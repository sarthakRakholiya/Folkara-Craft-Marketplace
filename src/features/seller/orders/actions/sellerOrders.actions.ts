"use server";

import { db } from "@/lib/db";
import { orders, orderItems, shops, products } from "@/db/schema";
import { getSession } from "@/lib/session";
import { eq, and, desc, or, ilike, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Retrieves all order item sales belonging to the seller's shop, supports pagination, status & search filters
 */
export async function getSellerOrdersAction(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  // 1. Resolve seller shop
  const userShop = await db.query.shops.findFirst({
    where: eq(shops.userId, session.userId),
  });

  if (!userShop) {
    return {
      orders: [],
      totalCount: 0,
      totalPages: 0,
      stats: {
        ALL: 0,
        PENDING: 0,
        IN_PROGRESS: 0,
        SHIPPED: 0,
        DELIVERED: 0,
        CANCELLED: 0,
      },
    };
  }

  // Dual-mode: If no pagination parameters are requested, return all orders in a paginated shape for consistency
  if (!params) {
    // Fetch all order items linked to this shop
    const items = await db.query.orderItems.findMany({
      where: eq(orderItems.shopId, userShop.id),
      with: {
        order: true,
        product: true,
      },
      orderBy: [desc(orderItems.createdAt)],
    });

    const stats = {
      ALL: items.length,
      PENDING: items.filter((i) => i.order.status === "PENDING").length,
      IN_PROGRESS: items.filter((i) => i.order.status === "IN_PROGRESS").length,
      SHIPPED: items.filter((i) => i.order.status === "SHIPPED").length,
      DELIVERED: items.filter((i) => i.order.status === "DELIVERED").length,
      CANCELLED: items.filter((i) => i.order.status === "CANCELLED").length,
    };

    // Map into convenient shape for seller dashboard
    const mappedOrders = items.map((item) => {
      const orderDateStr = new Date(item.order.createdAt).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      return {
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        productTitle: item.product?.title || "Craft Item",
        productImage: (item.product?.images as { url: string }[] | undefined)?.[0]?.url || "/placeholder.jpg",
        price: parseFloat(item.price),
        quantity: item.quantity,
        
        // Customer shipping details
        customerName: item.order.shippingName,
        shippingAddress: `${item.order.shippingAddress}, ${item.order.shippingCity}, ${item.order.shippingState} ${item.order.shippingPostalCode}, ${item.order.shippingCountry}`,
        deliveryMethod: item.order.deliveryMethod,
        orderDate: orderDateStr,
        
        // Status trackers
        status: item.order.status,
        paymentStatus: item.order.paymentStatus,
        trackingNumber: item.order.trackingNumber,
        
        // Parent financial values
        orderTotal: parseFloat(item.order.grandTotal),
        subtotal: parseFloat(item.order.subtotal),
        shippingCost: parseFloat(item.order.shippingCost),
        tax: parseFloat(item.order.tax),
        artisanNote: item.order.artisanNote || "",
      };
    });

    return {
      orders: mappedOrders,
      totalCount: items.length,
      totalPages: 1,
      stats,
    };
  }

  const page = params.page || 1;
  const limit = params.limit || 5;
  const offset = (page - 1) * limit;

  // Build filtering conditions
  const conditions = [eq(orderItems.shopId, userShop.id)];

  if (params.status && params.status !== "ALL") {
    conditions.push(eq(orders.status, params.status as any));
  }

  if (params.search) {
    const searchPattern = `%${params.search}%`;
    conditions.push(
      or(
        ilike(products.title, searchPattern),
        ilike(orders.shippingName, searchPattern),
        ilike(orders.id, searchPattern)
      ) as any
    );
  }

  // 1, 2, 3: Fetch total count of matches, paginated records, and shop-wide status counts in parallel
  const [countResult, joinedItems, statusCounts] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(and(...conditions)),

    db
      .select({
        orderItem: orderItems,
        order: orders,
        product: products,
        shop: shops,
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .innerJoin(products, eq(orderItems.productId, products.id))
      .leftJoin(shops, eq(orderItems.shopId, shops.id))
      .where(and(...conditions))
      .orderBy(desc(orderItems.createdAt))
      .limit(limit)
      .offset(offset),

    db
      .select({
        status: orders.status,
        count: sql<number>`count(*)`,
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(eq(orderItems.shopId, userShop.id))
      .groupBy(orders.status)
  ]);

  const totalCount = Number(countResult[0]?.count ?? 0);

  // Map statusCounts into stats map
  const stats = {
    ALL: 0,
    PENDING: 0,
    IN_PROGRESS: 0,
    SHIPPED: 0,
    DELIVERED: 0,
    CANCELLED: 0,
  };

  statusCounts.forEach((sc) => {
    const statusKey = sc.status as keyof typeof stats;
    if (stats[statusKey] !== undefined) {
      const count = Number(sc.count ?? 0);
      stats[statusKey] = count;
      stats.ALL += count;
    }
  });

  // 4. Map into the OrderItem format
  const mappedOrders = joinedItems.map(({ orderItem, order, product }) => {
    const orderDateStr = new Date(order.createdAt).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return {
      id: orderItem.id,
      orderId: orderItem.orderId,
      productId: orderItem.productId,
      productTitle: product?.title || "Craft Item",
      productImage: (product?.images as { url: string }[] | undefined)?.[0]?.url || "/placeholder.jpg",
      price: parseFloat(orderItem.price),
      quantity: orderItem.quantity,
      
      // Customer shipping details
      customerName: order.shippingName,
      shippingAddress: `${order.shippingAddress}, ${order.shippingCity}, ${order.shippingState} ${order.shippingPostalCode}, ${order.shippingCountry}`,
      deliveryMethod: order.deliveryMethod,
      orderDate: orderDateStr,
      
      // Status trackers
      status: order.status,
      paymentStatus: order.paymentStatus,
      trackingNumber: order.trackingNumber,
      
      // Parent financial values
      orderTotal: parseFloat(order.grandTotal),
      subtotal: parseFloat(order.subtotal),
      shippingCost: parseFloat(order.shippingCost),
      tax: parseFloat(order.tax),
      artisanNote: order.artisanNote || "",
    };
  });

  return {
    orders: mappedOrders,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    stats,
  };
}

/**
 * Updates the fulfillment state of an incoming order after seller authorization check
 */
export async function updateOrderStatusAction(
  orderId: string,
  status: "PENDING" | "IN_PROGRESS" | "SHIPPED" | "DELIVERED" | "CANCELLED"
) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  // 1. Resolve seller shop
  const userShop = await db.query.shops.findFirst({
    where: eq(shops.userId, session.userId),
  });
  if (!userShop) {
    return { success: false, error: "Artisan shop profile not found" };
  }

  // 2. Security validation: Verify order contains an item belonging to this shop
  const itemMatch = await db.query.orderItems.findFirst({
    where: and(
      eq(orderItems.orderId, orderId),
      eq(orderItems.shopId, userShop.id)
    ),
  });

  if (!itemMatch) {
    return { success: false, error: "Unauthorized access to order modifications" };
  }

  try {
    // 3. Mutate order status
    await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, orderId));

    revalidatePath("/seller/orders");
    revalidatePath("/buyer/orders");
    return { success: true };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false, error: "Failed to update status in database" };
  }
}

/**
 * Registers tracking coordinates for an order, moving status to SHIPPED
 */
export async function updateOrderTrackingAction(orderId: string, trackingNumber: string) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  // 1. Resolve seller shop
  const userShop = await db.query.shops.findFirst({
    where: eq(shops.userId, session.userId),
  });
  if (!userShop) {
    return { success: false, error: "Artisan shop profile not found" };
  }

  // 2. Security validation
  const itemMatch = await db.query.orderItems.findFirst({
    where: and(
      eq(orderItems.orderId, orderId),
      eq(orderItems.shopId, userShop.id)
    ),
  });

  if (!itemMatch) {
    return { success: false, error: "Unauthorized access to order modifications" };
  }

  try {
    // 3. Mutate tracking number and auto transition to SHIPPED if currently PENDING or IN_PROGRESS
    const currentOrder = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });

    let newStatus = currentOrder?.status || "SHIPPED";
    if (newStatus === "PENDING" || newStatus === "IN_PROGRESS") {
      newStatus = "SHIPPED";
    }

    await db
      .update(orders)
      .set({
        trackingNumber,
        status: newStatus,
      })
      .where(eq(orders.id, orderId));

    revalidatePath("/seller/orders");
    revalidatePath("/buyer/orders");
    return { success: true };
  } catch (error) {
    console.error("Failed to add tracking number:", error);
    return { success: false, error: "Failed to register tracking data" };
  }
}

/**
 * Transitions payment transaction status (e.g. Paid, Failed)
 */
export async function updateOrderPaymentStatusAction(
  orderId: string,
  paymentStatus: "UNPAID" | "PAID" | "FAILED"
) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  // Resolve seller shop
  const userShop = await db.query.shops.findFirst({
    where: eq(shops.userId, session.userId),
  });
  if (!userShop) {
    return { success: false, error: "Artisan shop profile not found" };
  }

  // Security check
  const itemMatch = await db.query.orderItems.findFirst({
    where: and(
      eq(orderItems.orderId, orderId),
      eq(orderItems.shopId, userShop.id)
    ),
  });

  if (!itemMatch) {
    return { success: false, error: "Unauthorized access to order modifications" };
  }

  try {
    await db
      .update(orders)
      .set({ paymentStatus })
      .where(eq(orders.id, orderId));

    revalidatePath("/seller/orders");
    revalidatePath("/buyer/orders");
    return { success: true };
  } catch (error) {
    console.error("Failed to update order payment status:", error);
    return { success: false, error: "Failed to update transaction state" };
  }
}

/**
 * Updates the custom artisan narrative/progress update note on the parent order
 */
export async function updateOrderArtisanNoteAction(
  orderId: string,
  artisanNote: string
) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  const userShop = await db.query.shops.findFirst({
    where: eq(shops.userId, session.userId),
  });

  if (!userShop) {
    return { success: false, error: "Shop not found" };
  }

  const itemMatch = await db.query.orderItems.findFirst({
    where: and(
      eq(orderItems.orderId, orderId),
      eq(orderItems.shopId, userShop.id)
    ),
  });

  if (!itemMatch) {
    return { success: false, error: "Unauthorized access to order modifications" };
  }

  try {
    await db
      .update(orders)
      .set({ artisanNote })
      .where(eq(orders.id, orderId));

    revalidatePath("/seller/orders");
    revalidatePath("/buyer/orders");
    return { success: true };
  } catch (error) {
    console.error("Failed to update order artisan note:", error);
    return { success: false, error: "Failed to update artisan note" };
  }
}

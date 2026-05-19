"use server";

import { db } from "@/lib/db";
import { orders, orderItems, shops } from "@/db/schema";
import { getSession } from "@/lib/session";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Retrieves all order item sales belonging to the seller's shop
 */
export async function getSellerOrdersAction() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  // 1. Resolve seller shop
  const userShop = await db.query.shops.findFirst({
    where: eq(shops.userId, session.userId),
  });

  if (!userShop) {
    return [];
  }

  // 2. Fetch all order items linked to this shop
  const items = await db.query.orderItems.findMany({
    where: eq(orderItems.shopId, userShop.id),
    with: {
      order: true,
      product: true,
    },
    orderBy: [desc(orderItems.createdAt)],
  });

  // 3. Map into convenient shape for seller dashboard
  return items.map((item) => {
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

"use server";

import { db } from "@/lib/db";
import { orders, orderItems } from "@/db/schema";
import { getSession } from "@/lib/session";
import { eq, desc, inArray } from "drizzle-orm";
import { OrderItem, OrderStatus } from "../types/order";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-04-22.dahlia",
    })
  : null;

/**
 * Fetches all order items purchased by the active buyer, mapped for the UI layout
 */
export async function getBuyerOrdersAction() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  // 1. Fetch user orders
  const userOrders = await db.query.orders.findMany({
    where: eq(orders.userId, session.userId),
    orderBy: [desc(orders.createdAt)],
    with: {
      items: {
        with: {
          product: true,
          shop: true,
        },
      },
    },
  });

  if (userOrders.length === 0) {
    return [];
  }

  // 2. Map relational Drizzle tables into flat OrderItem models
  const mappedItems: OrderItem[] = [];

  for (const order of userOrders) {
    for (const item of order.items) {
      if (!item.product) continue;

      // Status mapping: DB -> UI
      let uiStatus: OrderStatus = "PENDING";
      if (order.status === "DELIVERED") {
        uiStatus = "DELIVERED";
      } else if (order.status === "CANCELLED") {
        uiStatus = "CANCELLED";
      } else if (order.status === "SHIPPED") {
        uiStatus = "SHIPPED";
      } else if (order.status === "IN_PROGRESS") {
        uiStatus = "IN_PROGRESS";
      }

      const tags = (item.product.tags as string[]) || ["SLOW-MADE", "AUTHENTIC"];
      
      const orderDateStr = new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      const arrivalDateStr = new Date(
        new Date(order.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000
      ).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      mappedItems.push({
        id: item.id,
        orderId: order.id,
        title: item.product.title || "Craft Item",
        price: parseFloat(item.price),
        image: (item.product.images as { url: string }[] | undefined)?.[0]?.url || "/placeholder.jpg",
        tags,
        artisan: item.shop?.name || "Independent Artisan",
        orderDate: orderDateStr,
        arrivalDate: arrivalDateStr,
        deliveredDate: order.status === "DELIVERED" ? orderDateStr : undefined,
        trackingNumber: order.trackingNumber || `FLK-${item.id.slice(-5).toUpperCase()}`,
        status: uiStatus,
        stripeSessionId: (order as any).stripeSessionId,
      });
    }
  }

  return mappedItems;
}

/**
 * Fetches the specific details of a purchased order item
 */
export async function getBuyerOrderByIdAction(orderItemId: string) {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  // 1. Query the specific item
  const item = await db.query.orderItems.findFirst({
    where: eq(orderItems.id, orderItemId),
    with: {
      order: true,
      product: true,
      shop: true,
    },
  });

  if (!item || item.order.userId !== session.userId) {
    return null;
  }

  // Status mapping
  let uiStatus: OrderStatus = "PENDING";
  if (item.order.status === "DELIVERED") {
    uiStatus = "DELIVERED";
  } else if (item.order.status === "CANCELLED") {
    uiStatus = "CANCELLED";
  } else if (item.order.status === "SHIPPED") {
    uiStatus = "SHIPPED";
  } else if (item.order.status === "IN_PROGRESS") {
    uiStatus = "IN_PROGRESS";
  }

  const tags = (item.product.tags as string[]) || ["SLOW-MADE", "AUTHENTIC"];
  
  const orderDateStr = new Date(item.order.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const arrivalDateStr = new Date(
    new Date(item.order.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return {
    id: item.id,
    orderId: item.order.id,
    title: item.product.title,
    price: parseFloat(item.price),
    image: (item.product.images as { url: string }[] | undefined)?.[0]?.url || "/placeholder.jpg",
    tags,
    artisan: item.shop?.name || "Independent Artisan",
    artisanNote: item.order.artisanNote || (item.product as any).story || item.product.artisanAnalysis || "A slow-crafted relic built to inspire daily living.",
    orderDate: orderDateStr,
    arrivalDate: arrivalDateStr,
    deliveredDate: item.order.status === "DELIVERED" ? orderDateStr : undefined,
    trackingNumber: item.order.trackingNumber || `FLK-${item.id.slice(-5).toUpperCase()}`,
    status: uiStatus,
    rawStatus: item.order.status,
    stripeSessionId: (item.order as any).stripeSessionId,
    
    // Additional receipt & transit details
    shippingName: item.order.shippingName,
    shippingAddress: `${item.order.shippingAddress}, ${item.order.shippingCity}, ${item.order.shippingState} ${item.order.shippingPostalCode}, ${item.order.shippingCountry}`,
    shippingCost: parseFloat(item.order.shippingCost),
    subtotal: parseFloat(item.order.subtotal),
    tax: parseFloat(item.order.tax),
    grandTotal: parseFloat(item.order.grandTotal),
  };
}

/**
 * Retrieves the Stripe invoice hosted receipt URL for an order item, or indicates mock fallback
 */
export async function getBuyerOrderInvoiceUrlAction(orderItemId: string) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  const item = await db.query.orderItems.findFirst({
    where: eq(orderItems.id, orderItemId),
    with: {
      order: true,
    },
  });

  if (!item || item.order.userId !== session.userId) {
    return { success: false, error: "Order item not found" };
  }

  const stripeSessionId = (item.order as any).stripeSessionId;
  if (!stripeSessionId) {
    return { success: true, mock: true };
  }

  if (!stripe) {
    return { success: true, mock: true };
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.retrieve(stripeSessionId);
    if (!checkoutSession || !checkoutSession.payment_intent) {
      return { success: true, mock: true };
    }

    const paymentIntentId = typeof checkoutSession.payment_intent === "string"
      ? checkoutSession.payment_intent
      : checkoutSession.payment_intent.id;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const chargeId = typeof paymentIntent.latest_charge === "string"
      ? paymentIntent.latest_charge
      : paymentIntent.latest_charge?.id;

    if (!chargeId) {
      return { success: true, mock: true };
    }

    const charge = await stripe.charges.retrieve(chargeId);
    if (charge.receipt_url) {
      return { success: true, url: charge.receipt_url };
    }

    return { success: true, mock: true };
  } catch (error: any) {
    console.error("Stripe receipt retrieval failed, using fallback:", error);
    return { success: true, mock: true };
  }
}

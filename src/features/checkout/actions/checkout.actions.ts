"use server";

import { db } from "@/lib/db";
import { cartItems, orders, orderItems, shops, products } from "@/db/schema";
import { getSession } from "@/lib/session";
import { eq, desc, sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";

// Initialize Stripe conditionally
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16" as any,
    })
  : null;

const parsePrice = (priceVal: string | number) => {
  if (typeof priceVal === "number") return priceVal;
  return parseFloat(priceVal.replace(/[^0-9.]/g, "")) || 0;
};

/**
 * Creates a checkout session URL (Stripe or custom simulator fallback)
 */
export async function createCheckoutSessionAction() {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "You must be signed in to checkout" };
  }

  // 1. Fetch user's cart items
  const items = await db.query.cartItems.findMany({
    where: eq(cartItems.userId, session.userId),
    with: {
      product: true,
    },
  });

  if (!items || items.length === 0) {
    return { success: false, error: "Your shopping cart is empty" };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // 2. If Stripe is configured, create real Stripe Checkout Session
  if (stripe) {
    try {
      const lineItems = items.map((item) => {
        const productImages = item.product.images as
          | { url: string }[]
          | undefined;
        let imageUrl = productImages?.[0]?.url;

        if (imageUrl) {
          if (imageUrl.startsWith("/")) {
            imageUrl = `${appUrl}${imageUrl}`;
          }
          // If the image URL is not public (e.g. localhost), Stripe won't be able to fetch it.
          // Fall back to a beautiful public Unsplash craft image for local dev or placeholder cases.
          if (imageUrl.includes("localhost") || imageUrl.includes("127.0.0.1")) {
            imageUrl = "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80";
          }
        } else {
          imageUrl = "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80";
        }

        const price = parsePrice(item.product.price);

        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: item.product.title || "Craft Product",
              description: item.product.description || undefined,
              images: [imageUrl],
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: item.quantity,
        };
      });

      const orderId = `ord_${createId()}`;
      const subtotal = items.reduce((sum, item) => {
        return sum + parsePrice(item.product.price) * item.quantity;
      }, 0);

      // Pre-create the unpaid order sequentially
      await db.insert(orders).values({
        id: orderId,
        userId: session.userId,
        status: "PENDING",
        paymentStatus: "UNPAID",
        deliveryMethod: "standard",
        shippingName: "Pending Stripe Checkout",
        shippingAddress: "Pending Stripe Checkout",
        shippingCity: "Pending",
        shippingState: "Pending",
        shippingCountry: "IN",
        shippingPostalCode: "Pending",
        shippingCost: "150.00",
        subtotal: subtotal.toString(),
        tax: "0.00",
        grandTotal: (subtotal + 150).toString(),
      });

      const orderItemsValues = items.map((item) => ({
        id: `ori_${createId()}`,
        orderId: orderId,
        productId: item.productId,
        shopId: item.product.shopId,
        quantity: item.quantity,
        price: parsePrice(item.product.price).toString(),
      }));

      await db.insert(orderItems).values(orderItemsValues);

      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        shipping_address_collection: {
          allowed_countries: ["IN", "US", "CA", "GB"],
        },
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: {
                amount: 15000, // ₹150.00
                currency: "inr",
              },
              display_name: "Standard Shipping",
              delivery_estimate: {
                minimum: { unit: "business_day", value: 5 },
                maximum: { unit: "business_day", value: 7 },
              },
            },
          },
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: {
                amount: 35000, // ₹350.00
                currency: "inr",
              },
              display_name: "Express Shipping",
              delivery_estimate: {
                minimum: { unit: "business_day", value: 1 },
                maximum: { unit: "business_day", value: 3 },
              },
            },
          },
        ],
        success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/cart`,
        metadata: {
          userId: session.userId,
          orderId: orderId,
        },
      });

      return { success: true, url: stripeSession.url };
    } catch (error: any) {
      console.error("Stripe Session Creation Error:", error);
      return {
        success: false,
        error: `Stripe Checkout Session creation failed: ${error.message || error}`,
      };
    }
  }

  return {
    success: false,
    error: "Stripe configuration is missing or inactive on the server.",
  };
}

/**
 * Fulfills a real Stripe hosted checkout session
 */
export async function fulfillStripeOrderAction(stripeSessionId: string) {
  const session = await getSession();
  if (!session) return { success: false, error: "Unauthorized" };

  if (!stripe) {
    return { success: false, error: "Stripe not configured" };
  }

  try {
    // 1. Retrieve the session from Stripe
    const stripeSession =
      await stripe.checkout.sessions.retrieve(stripeSessionId) as any;
    if (!stripeSession) {
      return { success: false, error: "Stripe session not found" };
    }

    // Check if user matches
    const userId = stripeSession.metadata?.userId;
    if (userId !== session.userId) {
      return { success: false, error: "Unauthorized session access" };
    }

    // Retrieve orderId from Stripe session metadata
    const orderId = stripeSession.metadata?.orderId;
    if (!orderId) {
      return { success: false, error: "Order ID not found in session metadata" };
    }

    // Check if the pre-created order exists
    const existingOrder = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });

    if (!existingOrder) {
      return { success: false, error: "Associated order not found in database" };
    }

    // If already PAID, return success immediately (idempotency)
    if (existingOrder.paymentStatus === "PAID") {
      return { success: true, orderId };
    }

    // If Stripe payment status is not "paid", mark order as FAILED/CANCELLED and return error
    if (stripeSession.payment_status !== "paid") {
      await db.update(orders)
        .set({
          paymentStatus: "FAILED",
          status: "CANCELLED",
        })
        .where(eq(orders.id, orderId));
      
      return {
        success: false,
        error: `Payment was not completed successfully. Stripe payment status is ${stripeSession.payment_status}.`,
      };
    }

    // Complete the unpaid order inside a transaction
    const shippingName = stripeSession.shipping_details?.name || "Customer";
    const addressLine = stripeSession.shipping_details?.address?.line1 || "N/A";
    const city = stripeSession.shipping_details?.address?.city || "N/A";
    const state = stripeSession.shipping_details?.address?.state || "N/A";
    const country = stripeSession.shipping_details?.address?.country || "IN";
    const postalCode =
      stripeSession.shipping_details?.address?.postal_code || "N/A";

    const shippingCost = (stripeSession.shipping_cost?.amount_total || 0) / 100;
    const subtotal = (stripeSession.amount_subtotal || 0) / 100;
    const tax = (stripeSession.total_details?.amount_tax || 0) / 100;
    const grandTotal = (stripeSession.amount_total || 0) / 100;
    const deliveryMethod = shippingCost > 200 ? "express" : "standard";

    // Update order status to PAID and save final checkout details
    await db.update(orders)
      .set({
        paymentStatus: "PAID",
        status: "PENDING",
        deliveryMethod,
        shippingName,
        shippingAddress: addressLine,
        shippingCity: city,
        shippingState: state,
        shippingCountry: country,
        shippingPostalCode: postalCode,
        shippingCost: shippingCost.toString(),
        subtotal: subtotal.toString(),
        tax: tax.toString(),
        grandTotal: grandTotal.toString(),
        stripeSessionId: stripeSessionId,
      })
      .where(eq(orders.id, orderId));

    // Decrement product inventory quantities
    const oItems = await db.query.orderItems.findMany({
      where: eq(orderItems.orderId, orderId),
    });

    for (const item of oItems) {
      await db.update(products)
        .set({
          quantity: sql`quantity - ${item.quantity}`,
        })
        .where(eq(products.id, item.productId));
    }

    // Empty user's shopping cart
    await db.delete(cartItems).where(eq(cartItems.userId, session.userId));

    return { success: true, orderId };
  } catch (error: any) {
    console.error("Failed to fulfill Stripe order:", error);
    return { success: false, error: error.message || "Fulfillment failed" };
  }
}

/**
 * Retrieves details of a specific order
 */
export async function getOrderByIdAction(orderId: string) {
  const session = await getSession();
  if (!session) return null;

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: {
      items: {
        with: {
          product: true,
          shop: true,
        },
      },
    },
  });

  if (!order) return null;

  // Security check: only the buyer or a seller of one of the items can access
  if (order.userId !== session.userId && (session.role as string) !== "ADMIN") {
    const userShop = await db.query.shops.findFirst({
      where: eq(shops.userId, session.userId),
    });

    const isSellerOfItem = order.items.some(
      (item) => item.shopId === userShop?.id,
    );
    if (!isSellerOfItem) {
      return null;
    }
  }

  return order;
}

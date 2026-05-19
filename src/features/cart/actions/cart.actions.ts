"use server";

import { db } from "@/lib/db";
import { cartItems, products } from "@/db/schema";
import { getSession } from "@/lib/session";
import { eq, and } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { revalidatePath } from "next/cache";

/**
 * Retrieves all shopping bag items for the authenticated user
 */
export async function getCartItemsAction() {
  const session = await getSession();
  if (!session) return [];

  const items = await db.query.cartItems.findMany({
    where: eq(cartItems.userId, session.userId),
    with: {
      product: {
        with: {
          shop: true,
        },
      },
    },
    orderBy: (table, { desc }) => [desc(table.createdAt)],
  });

  return items;
}

/**
 * Inserts or atomically increments a product inside the user's shopping bag
 */
export async function addToCartAction(productId: string, quantity: number = 1) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  // Prevent sellers from purchasing their own products
  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
    with: {
      shop: true,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.shop?.userId === session.userId) {
    throw new Error("You cannot purchase your own product");
  }

  // Check if item already exists inside this user's cart
  const existing = await db.query.cartItems.findFirst({
    where: and(
      eq(cartItems.userId, session.userId),
      eq(cartItems.productId, productId)
    ),
  });

  if (existing) {
    const updated = await db
      .update(cartItems)
      .set({
        quantity: existing.quantity + quantity,
      })
      .where(eq(cartItems.id, existing.id))
      .returning();

    revalidatePath("/cart");
    return { success: true, data: updated[0] };
  }

  // Create new cart item
  const newCartItem = await db
    .insert(cartItems)
    .values({
      id: createId(),
      userId: session.userId,
      productId,
      quantity,
    })
    .returning();

  revalidatePath("/cart");
  return { success: true, data: newCartItem[0] };
}

/**
 * Updates selected item quantity. If 0 or less, deletes the item.
 */
export async function updateCartItemQuantityAction(itemId: string, quantity: number) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  if (quantity <= 0) {
    await db
      .delete(cartItems)
      .where(and(eq(cartItems.id, itemId), eq(cartItems.userId, session.userId)));

    revalidatePath("/cart");
    return { success: true, deleted: true };
  }

  const updated = await db
    .update(cartItems)
    .set({ quantity })
    .where(and(eq(cartItems.id, itemId), eq(cartItems.userId, session.userId)))
    .returning();

  revalidatePath("/cart");
  return { success: true, data: updated[0] };
}

/**
 * Removes an item from the user's shopping bag
 */
export async function removeFromCartAction(itemId: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  await db
    .delete(cartItems)
    .where(and(eq(cartItems.id, itemId), eq(cartItems.userId, session.userId)));

  revalidatePath("/cart");
  return { success: true };
}

/**
 * Empties all items from the user's shopping bag
 */
export async function clearCartAction() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  await db
    .delete(cartItems)
    .where(eq(cartItems.userId, session.userId));

  revalidatePath("/cart");
  return { success: true };
}

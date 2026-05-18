"use server";

import { db } from "@/lib/db";
import { favorites } from "@/db/schema";
import { getSession } from "@/lib/session";
import { eq, and, sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { revalidatePath } from "next/cache";

type ActionResult<T> = { data?: T; error?: string };

/**
 * Checks if a specific product is favorited by the logged-in user
 */
export async function checkIsFavorited(productId: string): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;

  const existing = await db.query.favorites.findFirst({
    where: and(
      eq(favorites.userId, session.userId),
      eq(favorites.productId, productId)
    ),
  });

  return !!existing;
}

/**
 * Toggles favorite state (Atomic CTE Approach)
 * Combines Delete-if-exists and Insert-if-missing into a single DB trip!
 */
export async function toggleFavorite(productId: string): Promise<ActionResult<{ isFavorited: boolean }>> {
  const session = await getSession();
  if (!session) {
    return { error: "Please log in to save items for later." };
  }

  try {
    const newId = createId();

    // Single-trip atomic query:
    // 1. Tries to delete the favorite. If successful, 'deleted' holds 1 row.
    // 2. If 'deleted' has 0 rows, it inserts a new favorite.
    // 3. Returns true if inserted, false if deleted.
    const result = await db.execute(sql`
      WITH deleted AS (
        DELETE FROM ${favorites}
        WHERE ${favorites.userId} = ${session.userId} AND ${favorites.productId} = ${productId}
        RETURNING id
      ),
      inserted AS (
        INSERT INTO ${favorites} (id, user_id, product_id)
        SELECT ${newId}, ${session.userId}, ${productId}
        WHERE NOT EXISTS (SELECT 1 FROM deleted)
        RETURNING id
      )
      SELECT EXISTS (SELECT 1 FROM inserted) as "isFavorited";
    `);

    // Drizzle returns rows inside a .rows array on Neon Serverless driver
    const rows = result.rows as unknown as Array<{ isFavorited: boolean }>;
    const isFavorited = rows[0]?.isFavorited ?? false;

    revalidatePath(`/products/${productId}`);
    revalidatePath("/favorites");
    
    return { data: { isFavorited } };
  } catch (error) {
    console.error("Database toggle failed:", error);
    return { error: "Failed to update favorites list." };
  }
}

export async function getUserFavorites() {
  const session = await getSession();
  if (!session) return [];

  const results = await db.query.favorites.findMany({
    where: eq(favorites.userId, session.userId),
    with: {
      product: {
        with: {
          shop: true
        }
      }
    },
    orderBy: (favorites, { desc }) => [desc(favorites.createdAt)]
  });

  return results.map(fav => fav.product).filter(Boolean);
}

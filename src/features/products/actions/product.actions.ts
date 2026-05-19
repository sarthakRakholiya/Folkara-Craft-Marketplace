"use server";

import { db } from "@/lib/db";
import { products, shops, users } from "@/db/schema";
import { eq, and, ne, desc, or, sql, type SQL } from "drizzle-orm";

export async function getProductByIdAction(id: string) {
  const result = await db
      .select({
        product: products,
        shop: shops,
        seller: users,
      })
      .from(products)
      .innerJoin(shops, eq(products.shopId, shops.id))
      .innerJoin(users, eq(shops.userId, users.id))
      .where(eq(products.id, id))
      .limit(1);

  return result[0] || null;
}

export async function getRelatedProductsAction(category: string | null, tags: string[] = [], excludeId: string, limit = 4) {
    const conditions = [
      ne(products.id, excludeId),
      eq(products.status, "ACTIVE")
    ];

    const orConditions = [];
    if (category) {
      orConditions.push(eq(products.category, category));
    }
    
    if (tags.length > 0) {
      // Postgres JSONB intersection check: any tag in the array exists in the tags column
      orConditions.push(sql`${products.tags} ?| array[${sql.join(tags, sql`, `)}]`);
    }

    if (orConditions.length > 0) {
      conditions.push(or(
        ...orConditions
      ) as SQL);
    }

    const result = await db
      .select()
      .from(products)
      .where(and(...conditions))
      .limit(limit)
      .orderBy(desc(products.createdAt));

  return result;
}

/**
 * Fetches the most recent active products for the landing page showcase
 */
export async function getTopProductsAction(limit = 8) {
  const result = await db
    .select({
      id: products.id,
      title: products.title,
      category: products.category,
      price: products.price,
      images: products.images,
      shopId: products.shopId,
    })
    .from(products)
    .where(eq(products.status, "ACTIVE"))
    .orderBy(desc(products.createdAt))
    .limit(limit);

  return result;
}


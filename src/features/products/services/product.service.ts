import { db } from "@/lib/db";
import { products, shops, users } from "@/db/schema";
import { eq, and, ne, desc, or, sql, type SQL } from "drizzle-orm";

export const productService = {
  async getProductById(id: string) {
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
  },

  async getRelatedProducts(category: string | null, tags: string[] = [], excludeId: string, limit = 4) {
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
  },
};

"use server";

import { db } from "@/lib/db";
import { products, shops } from "@/db/schema";
import { eq, and, gt, gte, lte, like, desc, asc, inArray } from "drizzle-orm";

export async function getPublicListingsAction(params: {
  page: number;
  limit: number;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: "price-asc" | "price-desc" | "newest";
}) {
  try {
    const { page, limit, categories, minPrice, maxPrice, search, sort = "newest" } = params;
    const offset = (page - 1) * limit;

    const conditions = [
      eq(products.status, "ACTIVE"),
      gt(products.quantity, 0),
    ];

    if (categories && categories.length > 0 && !categories.includes("All")) {
      conditions.push(inArray(products.category, categories));
    }

    if (minPrice !== undefined && minPrice > 0) {
      conditions.push(gte(products.price, minPrice.toString()));
    }

    if (maxPrice !== undefined && maxPrice > 0) {
      conditions.push(lte(products.price, maxPrice.toString()));
    }

    if (search) {
      conditions.push(like(products.title, `%${search}%`));
    }

    let orderBy;
    switch (sort) {
      case "price-asc":
        orderBy = asc(products.price);
        break;
      case "price-desc":
        orderBy = desc(products.price);
        break;
      case "newest":
      default:
        orderBy = desc(products.createdAt);
    }

    const items = await db
      .select({
        id: products.id,
        title: products.title,
        price: products.price,
        images: products.images,
        category: products.category,
        author: shops.name,
        createdAt: products.createdAt,
      })
      .from(products)
      .innerJoin(shops, eq(products.shopId, shops.id))
      .where(and(...conditions))
      .limit(limit)
      .offset(offset)
      .orderBy(orderBy);

    // Map database results to ExploreItem format
    const formattedItems = items.map((item) => ({
      id: item.id,
      type: 'product' as const,
      title: item.title || "Untitled Masterpiece",
      author: `By ${item.author}`,
      price: `₹${item.price}`,
      image: item.images[0]?.url || "",
      // Randomly assign badges for visual flair (picked/trending)
      badge: Math.random() > 0.8 ? {
        text: Math.random() > 0.5 ? "Picked for you" : "Trending",
        variant: Math.random() > 0.5 ? "picked" as const : "trending" as const
      } : undefined
    }));

    return {
      success: true,
      data: formattedItems,
      nextPage: items.length === limit ? page + 1 : null,
    };
  } catch (error) {
    console.error("[getPublicListingsAction]", error);
    return { error: "Failed to fetch listings" };
  }
}

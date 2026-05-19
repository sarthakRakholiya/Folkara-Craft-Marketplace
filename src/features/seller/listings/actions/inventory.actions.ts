"use server";

import { db } from "@/lib/db";
import { products } from "@/db/schema";
import { type SQL, eq, and, desc, asc, count, sql } from "drizzle-orm";
import {
  InventoryProduct,
  ProductStatus,
  SortOption,
} from "../types/inventory.types";

// ── Status conditions map ─────────────────────────────────────────────────
const statusConditions: Record<string, SQL> = {
  active: eq(products.status, "ACTIVE"),
  draft: eq(products.status, "DRAFT"),
  "out-of-stock": eq(products.quantity, 0),
};

// ── Order by map ──────────────────────────────────────────────────────────
const orderByMap: Record<string, SQL> = {
  "price-low-to-high": asc(products.price),
  "price-high-to-low": desc(products.price),
  "stock-low-to-high": asc(products.quantity),
};

export async function getSellerListingsAction(params: {
  shopId: string;
  page: number;
  limit: number;
  status?: ProductStatus | "all";
  sort?: SortOption;
}) {
    const { shopId, page, limit, status, sort } = params;
    const offset = (page - 1) * limit;

    // ── Conditions ────────────────────────────────────────────────────────────
    const conditions: SQL[] = [eq(products.shopId, shopId)];

    if (status && status !== "all" && statusConditions[status]) {
      conditions.push(statusConditions[status]);
    }

    // ── Order ─────────────────────────────────────────────────────────────────
    const orderBy = orderByMap[sort ?? ""] ?? desc(products.createdAt);

    // ── Query ─────────────────────────────────────────────────────────────────
    const rows = await db
      .select({
        id: products.id,
        title: products.title,
        price: products.price,
        status: products.status,
        category: products.category,
        quantity: products.quantity,
        images: products.images,
        createdAt: products.createdAt,
        totalCount: sql<number>`count(*) OVER()`.mapWith(Number),
      })
      .from(products)
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    // ── Map to view type ──────────────────────────────────────────────────────
    const totalCount = rows[0]?.totalCount ?? 0;

    const mappedProducts: InventoryProduct[] = rows.map((p) => ({
      id: p.id,
      title: p.title || "Untitled Listing",
      price: Number(p.price),
      status:
        p.quantity === 0
          ? "out-of-stock"
          : p.status === "DRAFT"
            ? "draft"
            : ("active" as ProductStatus),
      category: p.category || "Uncategorized",
      stockCount: p.quantity,
      images: (p.images as { url: string; publicId: string }[]) || [],
      description: null,
      tags: null,
      artisanAnalysis: null,
      createdAt: p.createdAt,
    }));

    return {
      products: mappedProducts,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    };
}

export async function getInventoryStatsAction(shopId: string) {


    // Optimized single-query stats
    const statsResult = await db
      .select({
        all: count(),
        active: sql<number>`cast(count(*) filter (where ${products.status} = 'ACTIVE') as integer)`,
        draft: sql<number>`cast(count(*) filter (where ${products.status} = 'DRAFT') as integer)`,
        outOfStock: sql<number>`cast(count(*) filter (where ${products.quantity} = 0) as integer)`,
      })
      .from(products)
      .where(eq(products.shopId, shopId));


  const s = statsResult[0];
  return {
    all: s.all,
    active: s.active,
    draft: s.draft,
    "out-of-stock": s.outOfStock,
  };
}

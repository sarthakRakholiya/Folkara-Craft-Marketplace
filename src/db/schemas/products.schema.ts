import {
  pgTable,
  text,
  varchar,
  integer,
  numeric,
  timestamp,
  jsonb,
  pgEnum,
  customType,
  index,
} from "drizzle-orm/pg-core";
import { shops } from "./shops.schema";

// Status Enum - internal products naming
export const productStatusEnum = pgEnum("product_status", [
  "DRAFT",
  "ACTIVE",
  "INACTIVE",
]);

// Custom vector type for pgvector
const vector = customType<{ data: number[] }>({
  dataType() {
    return "vector(3072)";
  },
  toDriver(value: number[]) {
    return JSON.stringify(value);
  },
  fromDriver(value: unknown) {
    if (typeof value === "string") {
      return JSON.parse(value) as number[];
    }
    return value as number[];
  },
});

export const products = pgTable("products", {
  id: text("id").primaryKey(),

  // Link to the shop
  shopId: text("shop_id")
    .notNull()
    .references(() => shops.id, { onDelete: "cascade" }),

  // Basic Information
  title: varchar("title", { length: 255 }),
  description: text("description"),
  artisanAnalysis: text("artisan_analysis"), // Detailed AI analysis
  category: varchar("category", { length: 100 }),

  // Media (Array of objects stored as JSONB)
  // Structure: { url: string; publicId: string }[]
  images: jsonb("images")
    .$type<{ url: string; publicId: string }[]>()
    .default([])
    .notNull(),

  // Tags (Array of strings)
  tags: jsonb("tags").$type<string[]>().default([]).notNull(),

  // Commercials
  price: numeric("price", { precision: 10, scale: 2 }).default("0").notNull(),
  quantity: integer("quantity").default(1).notNull(),

  // Metadata & Status
  status: productStatusEnum("status").default("DRAFT").notNull(),

  // Semantic Search Vector
  embedding: vector("embedding"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
}, (table) => {
  return {
    shopIdIdx: index("shop_id_idx").on(table.shopId),
    statusIdx: index("status_idx").on(table.status),
  };
});

// TypeScript types
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

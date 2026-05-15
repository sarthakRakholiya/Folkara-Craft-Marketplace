"use server";

import { db } from "@/lib/db";
import { products, shops } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { uploadImage, deleteImage } from "@/lib/cloudinary";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";
import { generateObject, embed } from "ai";
import { groq } from "@ai-sdk/groq";
import { google } from "@ai-sdk/google";
import { AI_PROMPTS } from "@/features/aiAssistant/constants/aiPrompt.constants";
import {
  withAuthAction,
  withAuthQuery,
  type ActionResult,
} from "@/lib/actionMiddleware";

// Helper to get user's shop with retry logic for transient network blips
async function getShop(userId: string, retries = 2): Promise<any> {
  try {
    return await db.query.shops.findFirst({
      where: eq(shops.userId, userId),
      columns: { id: true, name: true },
    });
  } catch (error) {
    if (retries > 0) {
      console.warn(`[DB Retry] getShop failed for user ${userId}. Retrying... (${retries} left)`);
      await new Promise(resolve => setTimeout(resolve, 800)); // Wait 800ms
      return getShop(userId, retries - 1);
    }
    throw error;
  }
}

/**
 * Creates a draft product with uploaded images.
 */
export const createDraftProductAction = withAuthAction(
  async (
    { session },
    data: {
      images: string[];
      description?: string;
      productId?: string;
    },
  ) => {
    const shop = await getShop(session.userId);
    if (!shop) throw new Error("Shop not found. Please create a shop first.");

    const productId = data.productId || createId();
    let oldImages: { url: string; publicId: string }[] = [];

    if (data.productId) {
      const existingProduct = await db.query.products.findFirst({
        where: eq(products.id, data.productId),
        columns: { images: true, shopId: true },
      });

      if (existingProduct && existingProduct.shopId === shop.id) {
        oldImages =
          (existingProduct.images as { url: string; publicId: string }[]) || [];
      }
    }

    const uploadedImages = await Promise.all(
      data.images.map(async (img) => {
        if (img.startsWith("data:")) {
          const res = await uploadImage(img, "products");
          return { url: res.url, publicId: res.publicId };
        }
        // If it's an existing image object, return as is
        if (typeof img === "object" && img !== null) return img;
        // If it's a string (URL), try to find its publicId from oldImages
        const existing = oldImages.find((old) => old.url === img);
        return { url: img, publicId: existing?.publicId || "" };
      }),
    );

    if (data.productId) {
      // Cleanup orphaned images from Cloudinary
      const newPublicIds = new Set(
        uploadedImages.map((img) => img.publicId).filter(Boolean),
      );
      const orphans = oldImages.filter(
        (old) => old.publicId && !newPublicIds.has(old.publicId),
      );

      if (orphans.length > 0) {
        console.log(
          `[Cloudinary Cleanup] Deleting ${orphans.length} orphaned images for product ${productId}`,
        );
        await Promise.all(orphans.map((img) => deleteImage(img.publicId)));
      }

      await db
        .update(products)
        .set({
          description: data.description || "",
          images: uploadedImages as { url: string; publicId: string }[],
          updatedAt: new Date(),
        })
        .where(eq(products.id, data.productId));
    } else {
      await db.insert(products).values({
        id: productId,
        shopId: shop.id,
        description: data.description || "",
        images: uploadedImages as { url: string; publicId: string }[],
        status: "DRAFT",
      });
    }

    return { success: true, data: productId };
  },
);

/**
 * Fetches a product by ID.
 */
export const getProductByIdAction = withAuthQuery(
  async ({ session }, productId: string) => {
    const [product, shop] = await Promise.all([
      db.query.products.findFirst({
        where: eq(products.id, productId),
      }),
      getShop(session.userId),
    ]);

    if (!product) throw new Error("Listing not found");
    if (!shop || product.shopId !== shop.id)
      throw new Error("Unauthorized access");

    return product;
  },
);

/**
 * Generates narrative using Groq AI.
 */
export const generateProductNarrativeAction = withAuthAction(
  async (
    { session },
    { productId, imageBase64s }: { productId: string; imageBase64s?: string[] },
  ) => {
    let imagesForAI = imageBase64s || [];

    if (imagesForAI.length === 0) {
      const product = await db.query.products.findFirst({
        where: eq(products.id, productId),
        columns: { images: true },
      });
      if (product && Array.isArray(product.images)) {
        imagesForAI = (product.images as { url: string }[]).map(
          (img) => img.url,
        );
      }
    }

    if (imagesForAI.length === 0)
      throw new Error("No images found for analysis");

    const { object } = await generateObject({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      schema: z.object({
        title: z.string(),
        description: z.string(),
        artisanAnalysis: z.string(),
        category: z.string(),
        tags: z.array(z.string()),
        suggestedPrice: z.number(),
      }),
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: AI_PROMPTS.PRODUCT_NARRATIVE },
            ...imagesForAI.map((img) => ({
              type: "image" as const,
              image: img,
            })),
          ],
        },
      ],
    });

    await db
      .update(products)
      .set({
        title: object.title,
        description: object.description,
        artisanAnalysis: object.artisanAnalysis,
        category: object.category,
        tags: object.tags,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId));

    return { success: true, data: object };
  },
);

/**
 * Finalizes and publishes the product.
 */
export const publishProductAction = withAuthAction(
  async (
    { session },
    {
      productId,
      data,
    }: {
      productId: string;
      data: {
        price: number;
        quantity: number;
        title: string;
        description: string;
        category: string;
        tags: string[];
      };
    },
  ) => {
    const embeddingContext = `
      Title: ${data.title}
      Category: ${data.category}
      Tags: ${data.tags.join(", ")}
      Description: ${data.description}
      Price: $${data.price}
    `.trim();

    const { embedding } = await embed({
      model: google.embedding("gemini-embedding-001"),
      value: embeddingContext,
    });

    await db
      .update(products)
      .set({
        ...data,
        price: data.price.toString(),
        status: "ACTIVE",
        embedding,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId));

    return { success: true };
  },
);

/**
 * Refines the narrative based on user feedback.
 */
export const refineProductNarrativeAction = withAuthAction(
  async (
    _,
    { productId, feedback }: { productId: string; feedback: string },
  ) => {
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
    });

    if (!product) throw new Error("Listing not found");

    const { object } = await generateObject({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      schema: z.object({
        title: z.string(),
        description: z.string(),
        category: z.string(),
        artisanAnalysis: z.string(),
        tags: z.array(z.string()),
      }),
      messages: [
        {
          role: "system",
          content: AI_PROMPTS.PRODUCT_REFINEMENT.SYSTEM,
        },
        {
          role: "user",
          content: AI_PROMPTS.PRODUCT_REFINEMENT.USER(product, feedback),
        },
      ],
    });

    await db
      .update(products)
      .set({
        title: object.title,
        description: object.description,
        category: object.category,
        artisanAnalysis: object.artisanAnalysis,
        tags: object.tags,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId));

    return { success: true, data: object };
  },
);

/**
 * Deletes a product and its images.
 */
export const deleteProductAction = withAuthAction(
  async ({ session }, productId: string) => {
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
      columns: { shopId: true, images: true },
    });

    if (!product) throw new Error("Listing not found");

    const shop = await getShop(session.userId);
    if (!shop || product.shopId !== shop.id)
      throw new Error("Unauthorized access");

    /**
     * TODO: Check if this product has any active orders.
     * If it does, we should prevent deletion and suggest archiving or marking as out-of-stock instead.
     */

    if (Array.isArray(product.images)) {
      await Promise.all(
        (product.images as { publicId: string }[]).map(async (img) => {
          if (img.publicId) await deleteImage(img.publicId);
        }),
      );
    }

    await db.delete(products).where(eq(products.id, productId));

    return { success: true };
  },
);

/**
 * Updates a product's stock quantity.
 */
export const updateProductStockAction = withAuthAction(
  async (
    { session },
    { productId, newQuantity }: { productId: string; newQuantity: number },
  ) => {
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
      columns: { shopId: true },
    });

    if (!product) throw new Error("Listing not found");

    const shop = await getShop(session.userId);
    if (!shop || product.shopId !== shop.id)
      throw new Error("Unauthorized access");

    await db
      .update(products)
      .set({
        quantity: newQuantity,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId));

    return { success: true };
  },
);

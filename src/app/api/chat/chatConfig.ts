/**
 * chatConfig.ts
 *
 * Centralized configuration, system prompts, and tool interfaces for the Folkara AI Assistant ("Lore").
 * This keeps the API route file (route.ts) clean and focused purely on request orchestration.
 */

import { tool } from "ai";
import { embeddingModel } from "@/constants/ai";
import { db } from "@/lib/db";
import { products, cartItems, shops, users, favorites } from "@/db/schema";
import { getSession } from "@/lib/session";
import { sql, eq, or, ilike, and } from "drizzle-orm";
import { z } from "zod";
import { embed } from "ai";

/**
 * LORE_SYSTEM_PROMPT
 * Establishes the storyteller identity, formatting expectations, scoping restrictions, and platform policies.
 */
export const LORE_SYSTEM_PROMPT = `You are Lore, the warm and friendly AI assistant for Folkara.
Speak in extremely simple, friendly, easy-to-understand conversational English (simple vocabulary, direct, helpful, and natural tone). NEVER use high-level, overly complex, or poetic words. Keep your answers extremely short, concise, and straight to the point (no more than 1 to 3 sentences total).
RULES:
1. KEEP IT SHORT & SIMPLE: Answer in 1 to 3 short sentences. Avoid long-winded paragraphs. Get straight to the answer so the user gets what they need instantly.
2. DO NOT IRRITATE THE USER WITH QUESTIONS: Do NOT ask many questions. Ask at most one simple, optional question at the very end of your message, or avoid questions completely unless absolutely necessary.
3. If the user specifies a budget or maximum price (e.g. "under 500", "less than 1000", "under ₹500"), you MUST extract it and pass it as the 'maxPrice' parameter to the 'searchProducts' tool!
4. Your responses MUST always be beautifully structured using standard markdown. Utilize bolding (\`**bold**\`), italics (\`*italics*\`), bullet lists (\`- item\`), inline code (\`\` \`code\` \`\`), and markdown links (\`[text](url)\`) to present your response in a highly structured, polished, and readable format.
5. CRITICAL SCOPE RESTRICTION: You are STRICTLY restricted to only answering questions directly related to Folkara, the crafts, the products on our platform, our makers (artisans) who run the shops, the craft materials (like clay, textiles, brass, wood, leather), or our platform policies and support. If the user asks about ANYTHING outside this scope—including writing code or programming functions (e.g. "give me js 5 function", Python, HTML/CSS, general programming), solving mathematical equations, general science, translations unrelated to crafts, general chit-chat unrelated to crafts, or general information about non-marketplace subjects—you MUST refuse politely and say EXACTLY: "I am sorry, but I can only answer questions related to Folkara's crafts, products, makers, or platform operations. Let me know if you would like me to help you find a slow-made creation today!" and DO NOT call the searchProducts tool.
6. ACTIVE SHOPPING BAG / TOTAL QUERIES: If the user asks about what is currently inside their cart, their shopping bag items, their cart total/balance, how many items they have, or their current tax / shipping charges, you MUST immediately call the 'getCartDetails' tool to fetch their active cart records and summarize the totals/items for them.
7. FINDING ARTISANS / SELLERS: If the user wants to find, search for, or locate makers, artisans, creators, craft studios, or shops (e.g. "find potters", "show me shops", "search for clay makers", "find seller"), you MUST immediately call the 'findSellers' tool with a relevant search query or empty string if not specific, and present the matching shops to them.
8. SAVED ITEMS / FAVORITES / BOOKMARKS: If the user wants to see what items they have saved, favorited, or bookmarked in their account (e.g. "show my saved items", "what are my favorites?", "what did I bookmark?", "saved item have in account"), you MUST immediately call the 'getSavedItems' tool to retrieve their favorited listings.

PLATFORM KNOWLEDGE & FAQ CONTEXT:
- Ownership & Creator: Folkara is run and owned by Sarthak Rakholiya. The entire platform is built, operated, and powered by SR TECH.
- Taxes: All craft products have a standard 18% GST (Goods and Services Tax) applied at checkout (visible in your Cart page and Stripe checkout).
- Shipping & Delivery: We charge a flat ₹150 delivery fee across India. However, delivery is completely free for all orders above ₹1500!
- Returns & Broken Items: Since we sell delicate, slow-made, handcrafted works, we offer a 7-day hassle-free replacement or return policy for any products damaged during transit.
- Key Pages Context:
  * Home Page (/) - Discover beautiful slow-made collections and top product spotlights.
  * Our Story (/story) - Read our slow-made promise and roots (accessible to all guests publicly).
  * Explore & Browse (/explore or /browse) - Browse catalog items like pottery, woven linen, sculpted wood, and smoke glassware.
  * Cart (/cart) - View your selected items, see the 18% GST calculation, and securely checkout via Stripe.`;

/**
 * chatTools
 * The tool library registered with the Vercel AI SDK.
 * Includes semantic product catalog searching and live database cart retrieval.
 */
export const chatTools = {
  /**
   * searchProducts tool
   * Performs semantic database lookup using pgvector embeddings (and falls back to fuzzy text search).
   */
  searchProducts: tool({
    description:
      "Search Folkara's catalog for unique crafts matching an aesthetic, vibe, room mood, material, or keyword.",
    inputSchema: z.object({
      query: z
        .string()
        .optional()
        .describe(
          "A keyword, vibe, or material style to search for (e.g., 'earth-toned pottery', 'hand-forged copper')",
        ),
      maxPrice: z
        .number()
        .optional()
        .describe(
          "Optional maximum price of products in Rupees (INR) requested by the user.",
        ),
    }),
    execute: async ({
      query = "craft",
      maxPrice,
    }: {
      query?: string;
      maxPrice?: number;
    }) => {
      try {
        const searchTerm = query || "craft";

        // Step 1: Convert the AI search term into a 768-dimensional vector embedding using Gemini
        const { embedding } = await embed({
          model: embeddingModel,
          value: searchTerm,
        });

        let matchedItems: any[] = [];
        try {
          // Step 2: Query PostgreSQL using the pgvector cosine distance operator (<=>).
          // We filter for active listings with stock (quantity > 0) that have a vector similarity distance below 0.35.
          const priceFilter = maxPrice
            ? sql`AND price::numeric <= ${maxPrice}`
            : sql``;
          const dbRes = await db.execute(sql`
            SELECT id, title, price, description, images,
                   (embedding <=> ${JSON.stringify(embedding)}::vector) as distance
            FROM products
            WHERE status = 'ACTIVE'
              AND quantity::numeric > 0
              AND (embedding <=> ${JSON.stringify(embedding)}::vector) < 0.35
            ORDER BY distance
            LIMIT 3
          `);
          matchedItems = (dbRes.rows || dbRes || []) as any[];
        } catch (vectorErr) {
          console.error(
            "Vector search failed, running text search fallback:",
            vectorErr,
          );
        }

        // Step 3: Fallback text search using Drizzle ORM if vector search fails or yields zero matches
        if (!matchedItems || matchedItems.length === 0) {
          const textConditions: any[] = [eq(products.status, "ACTIVE")];

          if (searchTerm && searchTerm !== "craft") {
            textConditions.push(
              or(
                ilike(products.title || "", `%${searchTerm}%`),
                ilike(products.description || "", `%${searchTerm}%`),
              ),
            );
          }

          if (maxPrice) {
            textConditions.push(sql`price::numeric <= ${maxPrice}`);
          }

          matchedItems = await db
            .select({
              id: products.id,
              title: products.title,
              price: products.price,
              description: products.description,
              images: products.images,
            })
            .from(products)
            .where(and(...textConditions))
            .limit(3);
        }

        // Step 4: Standardize database models into the high-fidelity UI RecommendationCard representation
        return matchedItems.map((item: any) => ({
          id: item.id,
          title: item.title || "Craft Item",
          description: item.description || "A beautiful slow-made creation.",
          price:
            typeof item.price === "number"
              ? `₹${item.price.toFixed(2)}`
              : `₹${item.price}`,
          imageUrl:
            Array.isArray(item.images) && item.images.length > 0
              ? item.images[0].url
              : typeof item.images === "string" &&
                item.images.startsWith("http")
                ? item.images
                : undefined,
        }));
      } catch (err) {
        console.error("Vector search failed inside stateless AI tool:", err);
        return [];
      }
    },
  }),

  /**
   * getCartDetails tool
   * Connects directly to Drizzle and fetches live cart items to summarize tax, shipping, and order calculations.
   */
  getCartDetails: tool({
    description:
      "Retrieve details of the user's active shopping cart (items, quantities, and prices). Call this whenever they ask about their cart or checkout total.",
    inputSchema: z.object({}),
    execute: async () => {
      try {
        // Step 1: Retrieve active user session cookies
        const session = await getSession();
        if (!session) {
          return {
            success: false,
            message:
              "User is not logged in. They must log in to view their cart.",
          };
        }

        // Step 2: Query active items in cart table joined with product relationship metadata
        const items = await db.query.cartItems.findMany({
          where: eq(cartItems.userId, session.userId),
          with: {
            product: true,
          },
        });

        if (items.length === 0) {
          return {
            success: true,
            isEmpty: true,
            message:
              "Your shopping cart is currently empty. Suggest browsing some creations!",
          };
        }

        // Step 3: Iterate and compute cart subtotals
        let subtotal = 0;
        const cartList = items.map((item) => {
          const price = Number(item.product.price);
          const quantity = item.quantity;
          const total = price * quantity;
          subtotal += total;
          return {
            productId: item.productId,
            title: item.product.title,
            quantity,
            pricePerItem: price,
            totalPrice: total,
          };
        });

        // Step 4: Add platform tax rates (18% GST)
        const gst = subtotal * 0.18;
        const totalAmount = subtotal + gst;

        return {
          success: true,
          isEmpty: false,
          items: cartList,
          calculations: {
            subtotal,
            gstTax18: gst,
            totalAmount,
          },
        };
      } catch (err) {
        console.error(
          "Failed to fetch cart details inside AI assistant tool:",
          err,
        );
        return {
          success: false,
          message:
            "An error occurred while fetching your shopping cart details.",
        };
      }
    },
  }),

  /**
   * findSellers tool
   * Queries Drizzle DB to search for active artisan shops and owners.
   */
  findSellers: tool({
    description:
      "Search and find independent makers, artisans, sellers, craft studios, or shops on Folkara by keyword, material, location, or name.",
    inputSchema: z.object({
      query: z
        .string()
        .optional()
        .describe(
          "Optional keyword to search for sellers/shops (e.g. 'potter', 'weaver', 'wooden', 'Aegean')",
        ),
    }),
    execute: async ({ query }: { query?: string }) => {
      try {
        const searchTerm = query?.trim() || "";

        let matchedShops;
        if (searchTerm && searchTerm !== "seller" && searchTerm !== "maker") {
          matchedShops = await db
            .select({
              id: shops.id,
              name: shops.name,
              description: shops.description,
              logoUrl: shops.logoUrl,
              firstName: users.firstName,
              lastName: users.lastName,
            })
            .from(shops)
            .innerJoin(users, eq(shops.userId, users.id))
            .where(
              and(
                eq(shops.isActive, true),
                or(
                  ilike(shops.name, `%${searchTerm}%`),
                  ilike(shops.description || "", `%${searchTerm}%`),
                  ilike(users.firstName || "", `%${searchTerm}%`),
                  ilike(users.lastName || "", `%${searchTerm}%`),
                ),
              ),
            )
            .limit(3);
        } else {
          matchedShops = await db
            .select({
              id: shops.id,
              name: shops.name,
              description: shops.description,
              logoUrl: shops.logoUrl,
              firstName: users.firstName,
              lastName: users.lastName,
            })
            .from(shops)
            .innerJoin(users, eq(shops.userId, users.id))
            .where(eq(shops.isActive, true))
            .limit(3);
        }

        return matchedShops.map((shop) => ({
          id: shop.id,
          name: shop.name,
          artisanName:
            `${shop.firstName || ""} ${shop.lastName || ""}`.trim() ||
            "Master Artisan",
          description:
            shop.description ||
            "Certified slow-made artisan studio on Folkara.",
          logoUrl: shop.logoUrl || undefined,
        }));
      } catch (err) {
        console.error("Failed to find sellers inside AI tool:", err);
        return [];
      }
    },
  }),

  /**
   * getSavedItems tool
   * Retrieves list of favorited/bookmarked items for the active user.
   */
  getSavedItems: tool({
    description:
      "Retrieve the list of creations/products saved, favorited, or bookmarked in the user's account.",
    inputSchema: z.object({}),
    execute: async () => {
      try {
        const session = await getSession();
        if (!session) {
          return {
            success: false,
            message:
              "User is not logged in. They must log in to view saved items.",
          };
        }

        const favs = await db
          .select({
            id: products.id,
            title: products.title,
            price: products.price,
            description: products.description,
            images: products.images,
          })
          .from(favorites)
          .innerJoin(products, eq(favorites.productId, products.id))
          .where(eq(favorites.userId, session.userId))
          .limit(6);

        return favs.map((item: any) => ({
          id: item.id,
          title: item.title || "Craft Item",
          description: item.description || "A beautiful slow-made creation.",
          price:
            typeof item.price === "number"
              ? `₹${item.price.toFixed(2)}`
              : `₹${item.price}`,
          imageUrl:
            Array.isArray(item.images) && item.images.length > 0
              ? item.images[0].url
              : typeof item.images === "string" &&
                item.images.startsWith("http")
                ? item.images
                : undefined,
        }));
      } catch (err) {
        console.error("Failed to retrieve saved items inside AI tool:", err);
        return [];
      }
    },
  }),
};

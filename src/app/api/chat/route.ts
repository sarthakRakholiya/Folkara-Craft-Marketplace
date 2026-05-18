import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";
import {
  streamText,
  tool,
  embed,
  stepCountIs,
  convertToModelMessages,
} from "ai";
import { db } from "@/lib/db";
import { products } from "@/db/schema";
import { sql, eq, or, ilike, and } from "drizzle-orm";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const modelMessages = await convertToModelMessages(messages);

    // 1. Configure Lore's wise storytelling identity
    const systemInstruction = `You are Lore, the warm and friendly AI assistant for Folkara.
Speak in extremely simple, friendly, easy-to-understand conversational English (simple vocabulary, direct, helpful, and natural tone). NEVER use high-level, overly complex, or poetic words.
RULES:
1. DO NOT ask many questions. Give direct, simple, helpful answers and immediately use the 'searchProducts' tool to fetch catalog entries matching the request.
2. If the user specifies a budget or maximum price (e.g. "under 500", "less than 1000", "under ₹500"), you MUST extract it and pass it as the 'maxPrice' parameter to the 'searchProducts' tool!
3. Your response MUST be extremely brief—strictly a SINGLE, short, simple paragraph (maximum 3 sentences). Never write multiple paragraphs, bullet points, or lists.`;

    // 2. Stream the response. NOTE: We do not save any messages to Neon!
    const result = await streamText({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      system: systemInstruction,
      messages: modelMessages,
      stopWhen: stepCountIs(5), // Allows the LLM to run the tool, receive results, and formulate the final response
      tools: {
        searchProducts: tool({
          description:
            "Search Folkara's catalog for unique crafts matching an aesthetic, vibe, room mood, material, or keyword.",
          inputSchema: z.object({
            query: z
              .string()
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
            query,
            maxPrice,
          }: {
            query: string;
            maxPrice?: number;
          }) => {
            try {
              // Convert the AI-selected term into a 768-dim vector embedding
              const { embedding } = await embed({
                model: google.embedding("gemini-embedding-001"),
                value: query,
              });

              // Query Drizzle using pgvector cosine distance similarity operator (<=>)
              let matchedItems: any[] = [];
              try {
                // Try semantic vector search first
                const priceFilter = maxPrice
                  ? sql`AND price::numeric <= ${maxPrice}`
                  : sql``;
                const dbRes = await db.execute(sql`
                  SELECT id, title, price, description, images,
                         (embedding <=> ${JSON.stringify(embedding)}::vector) as distance
                  FROM products
                  WHERE status = 'ACTIVE'
                    AND (embedding <=> ${JSON.stringify(embedding)}::vector) < 0.45
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

              // If vector search failed or returned no active products, fallback to text search
              if (!matchedItems || matchedItems.length === 0) {
                const textConditions = [
                  eq(products.status, "ACTIVE"),
                  or(
                    ilike(products.title || "", `%${query}%`),
                    ilike(products.description || "", `%${query}%`),
                  ),
                ];
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

              // Return mapped products in format expected by RecommendationCard
              return matchedItems.map((item: any) => ({
                id: item.id,
                title: item.title || "Craft Item",
                description:
                  item.description || "A beautiful slow-made creation.",
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
              console.error(
                "Vector search failed inside stateless AI tool:",
                err,
              );
              return [];
            }
          },
        }),
      },
    });

    return result.toUIMessageStreamResponse({ originalMessages: messages });
  } catch (error) {
    console.error("Simple stateless chat stream failed:", error);
    return new Response(JSON.stringify({ error: "Failed to process chat" }), {
      status: 500,
    });
  }
}

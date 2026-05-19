"use client";

import React from "react";
import { RecommendationCard } from "./RecommendationCard";
import { ShopCard } from "./ShopCard";

import { CartSummaryCard } from "./CartSummaryCard";

interface AiToolOutputProps {
  parts: any[];
}

/**
 * Resolves the tool name from an AI SDK message part.
 * Handles two shapes emitted by the SDK:
 *   1. { type: "tool-searchProducts", state, output }
 *   2. { type: "dynamic-tool", toolName: "findSellers", state, output }
 */
const resolveToolName = (part: any): string => {
  if (part.toolName) return part.toolName;
  if (typeof part.type === "string" && part.type.startsWith("tool-")) {
    return part.type.replace("tool-", "");
  }
  return "";
};
export const AiToolOutput = React.memo(({ parts }: AiToolOutputProps) => {
  if (!parts?.length) return null;

  return (
    <>
      {parts.map((part: any, partIdx: number) => {
        const toolName = resolveToolName(part);

        const isArrayOutputReady = Array.isArray(part.output) && part.output.length > 0;
        const isObjectOutputReady = typeof part.output === "object" && part.output !== null && !Array.isArray(part.output);
        const isReady = part.state === "output-available" && (isArrayOutputReady || isObjectOutputReady);
        
        if (!isReady) return null;

        const key = part.toolCallId ?? partIdx;

        // ── Products (searchProducts & getSavedItems) ───────────────────────
        if (toolName === "searchProducts" || toolName === "getSavedItems") {
          const label =
            toolName === "getSavedItems"
              ? "Your saved treasures"
              : "Matches your style";

          return (
            <div
              key={key}
              className="space-y-1.5 mt-2.5 pl-9 md:pl-10 animate-in fade-in slide-in-from-bottom-2 duration-500 w-full"
            >
              <p className="font-sans text-[9px] font-bold tracking-widest text-outline-variant/60 px-1 uppercase mb-1">
                {label}
              </p>
              <div className="flex gap-3 overflow-x-auto pb-3 pt-1 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full">
                {Array.isArray(part.output) && part.output.map((product: any) => (
                  <RecommendationCard
                    key={product.id}
                    title={product.title}
                    description={product.description}
                    price={product.price}
                    imageUrl={product.imageUrl}
                    href={`/products/${product.id}`}
                    productId={product.id}
                    className="snap-start"
                  />
                ))}
              </div>
            </div>
          );
        }

        // ── Shops (findSellers) ─────────────────────────────────────────────
        if (toolName === "findSellers") {
          return (
            <div
              key={key}
              className="space-y-1.5 mt-2.5 pl-9 md:pl-10 animate-in fade-in slide-in-from-bottom-2 duration-500 w-full"
            >
              <p className="font-sans text-[9px] font-bold tracking-widest text-outline-variant/60 px-1 uppercase mb-1">
                Artisan studios on Folkara
              </p>
              <div className="flex gap-3 overflow-x-auto pb-3 pt-1 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full">
                {Array.isArray(part.output) && part.output.map((shop: any) => (
                  <ShopCard
                    key={shop.id}
                    name={shop.name}
                    artisanName={shop.artisanName}
                    description={shop.description}
                    logoUrl={shop.logoUrl}
                    href={`/shops/${shop.id}`}
                    className="snap-start"
                  />
                ))}
              </div>
            </div>
          );
        }

        // ── Cart Summary (getCartDetails) ───────────────────────────────────
        if (toolName === "getCartDetails") {
          const cartOutput = part.output;
          
          if (!cartOutput.success || cartOutput.isEmpty) {
             return null;
          }

          return (
            <div
              key={key}
              className="mt-2.5 pl-9 md:pl-10 animate-in fade-in slide-in-from-bottom-2 duration-500 w-full"
            >
              <CartSummaryCard 
                items={cartOutput.items} 
                calculations={cartOutput.calculations} 
              />
            </div>
          );
        }

        return null;
      })}
    </>
  );
});
AiToolOutput.displayName = "AiToolOutput";

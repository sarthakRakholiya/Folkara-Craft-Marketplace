"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product } from "../exploreTypes";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Bookmark, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSessionData } from "@/features/auth/actions/auth.actions";
import { useFavoriteQuery, useToggleFavoriteMutation } from "@/features/products/hooks/useFavorite";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard = React.memo(
  ({ product, className }: ProductCardProps) => {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(false);

    // Queries status & manages favorite state changes locally per product card
    const { data: isFavorite } = useFavoriteQuery(product.id);
    const { mutate: toggleFavorite, isPending } = useToggleFavoriteMutation(product.id);

    // Intercept click propagation so clicking favorite button doesn't trigger card Link
    const handleSaveClick = async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setIsChecking(true);
      try {
        const session = await getSessionData();
        if (!session) {
          const nextPath = encodeURIComponent(window.location.pathname);
          router.push(`/auth?next=${nextPath}`);
          return;
        }
        toggleFavorite();
      } catch (err) {
        console.error("Failed to toggle favorite:", err);
      } finally {
        setIsChecking(false);
      }
    };

    // Helper to calculate 20% increase for "old price" as requested
    const numericPrice = parseFloat(product.price.replace(/[^0-9.]/g, ""));
    const oldPrice = isNaN(numericPrice) ? null : (numericPrice * 1.2).toFixed(0);
    const currency = product.price.replace(/[0-9.]/g, "").trim() || "$";

    return (
      <Link
        href={`/products/${product.id}`}
        className={cn("group cursor-pointer block relative", className)}
      >
        <div className="relative overflow-hidden rounded-xl bg-surface-container-low transition-all duration-500 hover:shadow-lg">
          {/* Aspect ratio container - slightly shorter for compactness */}
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 35vw, (max-width: 1024px) 25vw, 20vw"
            />
          </div>

          {/* Floating Save Button in Top Right */}
          <button
            onClick={handleSaveClick}
            disabled={isChecking || isPending}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-surface/90 backdrop-blur-sm border border-outline-variant/30 text-primary hover:bg-surface hover:text-secondary transition-all flex items-center justify-center shadow-sm cursor-pointer disabled:opacity-50 hover:scale-105 active:scale-95"
            aria-label="Save for Later"
          >
            {isChecking || isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Bookmark
                className={cn(
                  "w-3.5 h-3.5 transition-all duration-300",
                  isFavorite && "fill-current text-primary"
                )}
              />
            )}
          </button>

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.badge && (
              <span
                className={cn(
                  "backdrop-blur-sm px-2 py-0.5 rounded-full font-sans text-[8px] md:text-[10px] tracking-wider uppercase inline-block w-fit",
                  product.badge.variant === "picked"
                    ? "bg-tertiary-fixed/90 text-on-tertiary-fixed italic"
                    : "bg-secondary-container/90 text-on-secondary-container",
                )}
              >
                {product.badge.text}
              </span>
            )}
          </div>
        </div>

        <div className="mt-2.5 space-y-0.5">
          <h3 className="!font-sans text-sm md:text-base text-primary leading-tight group-hover:text-primary/80 transition-colors line-clamp-1">
            {product.title}
          </h3>

          <div className="flex flex-col gap-0.5">
            <p className="font-sans text-[10px] md:text-[11px] text-on-surface-variant truncate">
              {product.author}
            </p>
            <div className="flex items-center gap-2">
              <p className="font-sans font-bold text-xs md:text-sm text-secondary">
                {product.price}
              </p>
              {oldPrice && (
                <p className="font-sans text-[10px] md:text-xs text-on-surface-variant line-through opacity-60">
                  {currency}{oldPrice}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  },
);

ProductCard.displayName = "ProductCard";

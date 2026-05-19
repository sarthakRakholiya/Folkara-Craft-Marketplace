"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAddToCartMutation } from "@/features/cart/hooks/useCart";
import { ShoppingBag, Loader2 } from "lucide-react";

interface RecommendationCardProps {
  title: string;
  description: string;
  price?: string;
  imageUrl?: string;
  href?: string;
  icon?: string;
  className?: string;
  productId?: string;
}

export const RecommendationCard = ({
  title,
  description,
  price,
  imageUrl,
  href = "#",
  icon,
  className,
  productId,
}: RecommendationCardProps) => {
  const { mutate: addToCart, isPending: isAdding } = useAddToCartMutation();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!productId) return;
    addToCart({ productId, quantity: 1 });
  };
  return (
    <div
      className={cn(
        "group relative flex flex-col w-[170px] bg-surface-container-low border border-outline-variant/15 rounded-2xl hover:bg-surface-container transition-all duration-500 cursor-pointer overflow-hidden shadow-sm hover:shadow-md hover:border-outline-variant/30 flex-shrink-0 snap-start",
        className,
      )}
    >
      {/* Product Image */}
      <div className="relative w-full h-[105px] overflow-hidden bg-surface-container shrink-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="170px"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-secondary/40 text-lg">
              {icon || "filter_vintage"}
            </span>
          </div>
        )}

        {/* Price Tag Overlay */}
        {price && (
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-background/85 backdrop-blur-md border border-outline-variant/15 rounded-full shadow-sm z-20">
            <span className="font-sans text-[11px] font-semibold text-secondary">
              {price}
            </span>
          </div>
        )}

        {/* Add to Cart Floating Button */}
        {productId && (
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="absolute top-2 left-2 w-6 h-6 bg-background/90 hover:bg-primary hover:text-white backdrop-blur-md border border-outline-variant/15 text-primary rounded-full shadow-md z-30 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group/btn disabled:opacity-50"
            title="Add to Shopping Bag"
          >
            {isAdding ? (
              <Loader2 className="w-3 h-3 animate-spin text-primary group-hover/btn:text-white" />
            ) : (
              <ShoppingBag className="w-4 h-4 text-primary group-hover/btn:text-white" />
            )}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 min-w-0">
        <h4 className="font-serif text-[13px] text-primary leading-tight font-medium truncate">
          {title}
        </h4>
        <p className="font-sans text-[10px] text-on-surface-variant/70 italic mt-1 line-clamp-2 leading-relaxed flex-1">
          {description}
        </p>

        {/* Action Button */}
        <div className="mt-2.5 flex items-center justify-between text-primary font-sans text-[10px] font-bold group-hover:text-secondary transition-colors shrink-0">
          <span>View Details</span>
          <span className="material-symbols-outlined text-[10px] translate-x-0 group-hover:translate-x-0.5 transition-transform">
            arrow_forward
          </span>
        </div>
      </div>

      {/* Subtle Link Overlay */}
      <Link href={href} className="absolute inset-0 z-10">
        <span className="sr-only">View {title}</span>
      </Link>
    </div>
  );
};

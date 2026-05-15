"use client";

import React, { useState } from "react";
import Image from "next/image";
import { InventoryProduct } from "../types/inventory.types";
import { cn } from "@/lib/utils";

interface InventoryProductCardProps {
  product: InventoryProduct;
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
  onUpdateStock?: (id: string, currentStock: number) => void;
}

export function InventoryProductCard({
  product,
  onEdit,
  onView,
  onDelete,
  onUpdateStock,
}: InventoryProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLowStock = product.stockCount > 0 && product.stockCount <= 5;
  const isOutOfStock = product.stockCount === 0 || product.status === 'out-of-stock';
  const isDraft = product.status === 'draft';

  const statusBadge = React.useMemo(() => {
    if (isDraft) return {
      dot: "bg-amber-500 animate-pulse",
      label: "Draft",
      labelClass: "text-amber-600 uppercase tracking-wider font-bold"
    };
    if (isOutOfStock) return {
      dot: "bg-error",
      label: "Out of Stock",
      labelClass: "text-error font-bold"
    };
    if (isLowStock) return {
      dot: "bg-error",
      label: `Low Stock (${product.stockCount} units)`,
      labelClass: "text-error font-bold"
    };
    return {
      dot: "bg-[#4CAF50]",
      label: `In Stock (${product.stockCount} units)`,
      labelClass: "text-outline"
    };
  }, [isDraft, isOutOfStock, isLowStock, product.stockCount]);

  return (
    <div className="group animate-in fade-in duration-500">
      <div className="relative overflow-hidden aspect-[4/5] bg-surface-container mb-4 rounded-lg">
        <Image
          src={imageError ? "/logo.png" : product.images[0]?.url || "/logo.png"}
          alt={product.title}
          fill
          className={cn(
            "object-cover transition-transform duration-700 group-hover:scale-105",
            imageError && "object-contain p-8 opacity-40 bg-white"
          )}
          onError={() => setImageError(true)}
        />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-surface/90 backdrop-blur-sm px-3 py-1 rounded-full font-label-caps text-[10px] text-primary">
            {product.category}
          </span>
        </div>

        {/* Draft Status Badge */}
        {isDraft && (
          <div className="absolute top-4 right-4 z-10">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/90 backdrop-blur-md text-white rounded-full shadow-lg border border-white/20 animate-in fade-in zoom-in duration-500">
              <span className="material-symbols-outlined text-[14px]">edit_document</span>
              <span className="font-label-caps text-[9px] font-black tracking-widest uppercase">Draft</span>
            </div>
          </div>
        )}

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
          {/* Main Action: View (Centered - Smaller) */}
          <button 
            onClick={() => onView?.(product.id)}
            className="w-12 h-12 bg-white text-primary rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group/btn border border-outline-variant/10"
            title={isDraft ? "Resume Creation" : "View Details"}
          >
            <span className="material-symbols-outlined text-2xl group-hover/btn:scale-110 transition-transform">
              {isDraft ? "edit_note" : "visibility"}
            </span>
          </button>

          {/* Quick Actions (Bottom Right) */}
          <div className="absolute bottom-6 right-6">
            {/* More Menu */}
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(!isMenuOpen);
                }}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 border border-outline-variant/10",
                  isMenuOpen ? "bg-primary text-white" : "bg-white text-on-surface hover:shadow-xl hover:-translate-y-0.5"
                )}
              >
                <span className="material-symbols-outlined text-lg">more_vert</span>
              </button>

              {isMenuOpen && (
                <div className="absolute bottom-full right-0 mb-3 w-52 bg-white rounded-[1.5rem] shadow-2xl border border-outline-variant/10 py-3 animate-in fade-in slide-in-from-bottom-2 duration-200 z-30 overflow-hidden">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      onUpdateStock?.(product.id, product.stockCount);
                    }}
                    className="w-full px-5 py-3 text-left text-[11px] font-label-caps font-bold tracking-widest text-black hover:bg-surface-container-low transition-colors flex items-center gap-3"
                  >
                    <span className="material-symbols-outlined text-[20px] text-primary">inventory_2</span>
                    ADD STOCK
                  </button>

                  <div className="h-[1px] bg-outline-variant/5 mx-3" />
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      onEdit?.(product.id);
                    }}
                    className="w-full px-5 py-3 text-left text-[11px] font-label-caps font-bold tracking-widest text-black hover:bg-surface-container-low transition-colors flex items-center gap-3"
                  >
                    <span className="material-symbols-outlined text-[20px] text-blue-600">edit</span>
                    EDIT LISTING
                  </button>

                  <div className="h-[1px] bg-outline-variant/5 mx-3" />

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      onDelete?.(product.id);
                    }}
                    className="w-full px-5 py-3 text-left text-[11px] font-label-caps font-bold tracking-widest text-black hover:bg-error/5 transition-colors flex items-center gap-3"
                  >
                    <span className="material-symbols-outlined text-[20px] text-error">delete</span>
                    DELETE
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-body-md font-semibold text-primary line-clamp-1">
            {product.title}
          </h3>
          <p className="font-headline-sm text-[18px]">
            ₹{product.price.toFixed(2)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={cn("w-2 h-2 rounded-full", statusBadge.dot)} />
          <p className={cn("font-label-caps text-[11px]", statusBadge.labelClass)}>
            {statusBadge.label}
          </p>
        </div>
      </div>
    </div>
  );
}

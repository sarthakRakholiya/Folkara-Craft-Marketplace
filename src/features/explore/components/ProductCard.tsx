"use client";

import React from 'react';
import Image from 'next/image';
import { Product } from '../explore.types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard = React.memo(({ product, className }: ProductCardProps) => {
  return (
    <Link href={`/products/${product.id}`} className={cn("group cursor-pointer block", className)}>
      <div className="relative overflow-hidden rounded-xl bg-surface-container-low transition-all duration-500 hover:shadow-lg">
        {/* Aspect ratio container to prevent layout shift */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
        </div>
        
        {product.badge && (
          <div className="absolute top-4 left-4">
            <span className={cn(
              "backdrop-blur-sm px-3 py-1 rounded-full font-sans text-[10px] tracking-wider uppercase",
              product.badge.variant === 'picked' 
                ? "bg-tertiary-fixed/90 text-on-tertiary-fixed italic" 
                : "bg-secondary-container/90 text-on-secondary-container"
            )}>
              {product.badge.text}
            </span>
          </div>
        )}
      </div>
      
      <div className="mt-6 space-y-1">
        <h3 className="font-serif text-xl md:text-2xl text-primary leading-tight">
          {product.title}
        </h3>
        <p className="font-sans text-base text-on-surface-variant">
          {product.author}
        </p>
        <p className="font-sans font-bold text-sm tracking-widest text-secondary uppercase pt-1">
          {product.price}
        </p>
      </div>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';

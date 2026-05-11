import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface RelatedProductsProps {
  products: Array<{
    id: string;
    title: string;
    price: string;
    imageUrl: string;
  }>;
}

const ProductCardSimple = ({ product, className, imageAspect }: { 
  product: RelatedProductsProps['products'][0], 
  className?: string,
  imageAspect: string 
}) => (
  <Link href={`/products/${product.id}`} className={cn("flex flex-col gap-4 group", className)}>
    <div className={cn("bg-surface-container rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md transition-all duration-500", imageAspect)}>
      <Image 
        src={product.imageUrl} 
        alt={product.title} 
        width={400} 
        height={500} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
      />
    </div>
    <div>
      <p className="font-sans text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">{product.title}</p>
      <p className="font-serif text-base text-primary mt-1">{product.price}</p>
    </div>
  </Link>
);

export const RelatedProducts = ({ products }: RelatedProductsProps) => {
  if (products.length < 4) return null;

  return (
    <section className="max-w-container-max mx-auto px-margin-page py-16 md:py-32">
      <div className="flex flex-col gap-8 md:gap-12">
        <div className="flex flex-col gap-2 md:gap-3 items-center text-center">
          <div className="px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-sans text-[9px] md:text-[10px] font-bold tracking-[0.1em] uppercase flex items-center gap-2 mb-1 shadow-sm">
            <span className="material-symbols-outlined text-[14px] md:text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            AI Guide Recommendations
          </div>
          <h2 className="font-serif text-2xl md:text-4xl text-primary">Pairs beautifully with these pieces</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-gutter">
          <ProductCardSimple 
            product={products[0]} 
            imageAspect="aspect-square" 
            className="md:mt-8" 
          />
          <ProductCardSimple 
            product={products[1]} 
            imageAspect="aspect-[4/5]" 
          />
          <ProductCardSimple 
            product={products[2]} 
            imageAspect="aspect-square" 
            className="md:mt-12" 
          />
          <ProductCardSimple 
            product={products[3]} 
            imageAspect="aspect-[3/4]" 
            className="md:mt-4" 
          />
        </div>
      </div>
    </section>
  );
};

"use client";

import React, { useMemo } from 'react';
import { ExploreItem } from '../explore.types';
import { ProductCard } from './ProductCard';
import { cn } from '@/lib/utils';

interface DiscoveryFeedProps {
  items: ExploreItem[];
  className?: string;
}

export const DiscoveryFeed = ({ items, className }: DiscoveryFeedProps) => {
  // Distribute items into columns for different breakpoints
  const columns4 = useMemo(() => {
    const cols: ExploreItem[][] = [[], [], [], []];
    items.forEach((item, index) => {
      cols[index % 4].push(item);
    });
    return cols;
  }, [items]);

  const columns3 = useMemo(() => {
    const cols: ExploreItem[][] = [[], [], []];
    items.forEach((item, index) => {
      cols[index % 3].push(item);
    });
    return cols;
  }, [items]);

  const columns2 = useMemo(() => {
    const cols: ExploreItem[][] = [[], []];
    items.forEach((item, index) => {
      cols[index % 2].push(item);
    });
    return cols;
  }, [items]);

  const renderItem = (item: ExploreItem) => {
    return <ProductCard key={item.id} product={item} />;
  };

  return (
    <section className={cn("px-4 md:px-margin-page py-section-gap max-w-container-max mx-auto", className)}>
      {/* XL Desktop Grid (4 columns) */}
      <div className="hidden xl:grid grid-cols-4 gap-gutter">
        {columns4.map((col, i) => (
          <div key={`col-4-${i}`} className="flex flex-col gap-gutter">
            {col.map(renderItem)}
          </div>
        ))}
      </div>

      {/* Large Desktop Grid (3 columns) */}
      <div className="hidden lg:grid xl:hidden grid-cols-3 gap-gutter">
        {columns3.map((col, i) => (
          <div key={`col-3-${i}`} className="flex flex-col gap-gutter">
            {col.map(renderItem)}
          </div>
        ))}
      </div>

      {/* Tablet Grid (2 columns) */}
      <div className="hidden md:grid lg:hidden grid-cols-2 gap-gutter">
        {columns2.map((col, i) => (
          <div key={`col-2-${i}`} className="flex flex-col gap-gutter">
            {col.map(renderItem)}
          </div>
        ))}
      </div>

      {/* Mobile Grid (1 column) */}
      <div className="grid md:hidden grid-cols-1 gap-gutter">
        {items.map(renderItem)}
      </div>
    </section>
  );
};

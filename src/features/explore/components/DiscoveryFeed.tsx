"use client";

import React, { useMemo } from 'react';
import { ExploreItem } from '../exploreTypes';
import { ProductCard } from './ProductCard';
import { cn } from '@/lib/utils';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useWindowSize } from '@/hooks/useWindowSize';

interface DiscoveryFeedProps {
  items: ExploreItem[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  className?: string;
}

export const DiscoveryFeed = ({ 
  items, 
  isLoading, 
  isFetchingNextPage, 
  hasNextPage, 
  fetchNextPage,
  className 
}: DiscoveryFeedProps) => {
  const { width } = useWindowSize();
  
  // Sentinel for infinite scroll
  const sentinelRef = useIntersectionObserver(() => {
    if (hasNextPage && !isFetchingNextPage && !isLoading) {
      fetchNextPage();
    }
  });

  // Calculate columns based on width
  const columnCount = useMemo(() => {
    if (width > 1280) return 4;
    if (width > 1024) return 3;
    if (width > 640) return 2;
    return 1;
  }, [width]);

  // Distribute items into columns
  const columns = useMemo(() => {
    const cols: ExploreItem[][] = Array.from({ length: columnCount }, () => []);
    items.forEach((item, index) => {
      cols[index % columnCount].push(item);
    });
    return cols;
  }, [items, columnCount]);

  return (
    <section className={cn("w-full", className)}>
      {isLoading && items.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
           {[...Array(8)].map((_, i) => (
             <div key={i} className="space-y-4">
               <div className="aspect-[3/4] bg-surface-container-low animate-pulse rounded-xl" />
               <div className="h-6 w-2/3 bg-surface-container-low animate-pulse rounded" />
               <div className="h-4 w-1/2 bg-surface-container-low animate-pulse rounded" />
             </div>
           ))}
        </div>
      ) : (
        <div className="flex gap-6 md:gap-8 items-start">
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="flex-1 flex flex-col gap-8">
              {column.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Sentinel for infinite scroll */}
      <div ref={sentinelRef} className="h-40 w-full flex items-center justify-center mt-12">
        {isFetchingNextPage && (
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <p className="font-serif italic text-sm text-primary/40">Uncovering more treasures...</p>
          </div>
        )}
      </div>

      {!hasNextPage && items.length > 0 && !isLoading && (
        <div className="text-center py-24 px-4 border-t border-outline-variant/10 mt-16">
          <p className="text-xl md:text-2xl text-primary font-serif italic mb-2">
            &quot;The discovery ends here.&quot;
          </p>
          <p className="text-sm text-on-surface-variant/60 font-sans tracking-widest uppercase">
            You&apos;ve viewed our entire curated collection.
          </p>
        </div>
      )}

      {!isLoading && items.length === 0 && (
        <div className="text-center py-32 px-4 bg-surface-container-low/30 rounded-3xl border border-dashed border-outline-variant/20">
          <p className="text-2xl text-primary font-serif italic mb-4">
            No items found matching your filters.
          </p>
          <p className="text-on-surface-variant max-w-md mx-auto">
            Try adjusting your filters or clearing them to see all public listings.
          </p>
        </div>
      )}
    </section>
  );
};

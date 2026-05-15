"use client";

import React from 'react';
import { useQueryState, parseAsString, parseAsInteger, parseAsArrayOf } from 'nuqs';
import { DiscoveryFeed } from '../components/DiscoveryFeed';
import { ExploreSidebar } from '../components/ExploreSidebar';
import { useInfiniteExplore } from '../hooks/useInfiniteExplore';
import { Filter } from 'lucide-react';
import { useState } from 'react';

export const ExploreView = () => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  // Get filter state from URL (synced with ExploreSidebar)
  const [categories] = useQueryState('categories', parseAsArrayOf(parseAsString).withDefault([]));
  const [minPrice] = useQueryState('minPrice', parseAsInteger.withDefault(0));
  const [maxPrice] = useQueryState('maxPrice', parseAsInteger.withDefault(0));
  const [search] = useQueryState('search', parseAsString.withDefault(''));
  const [sort] = useQueryState('sort', parseAsString.withDefault('newest'));

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useInfiniteExplore({
    categories,
    minPrice,
    maxPrice,
    search,
    sort: sort as "price-asc" | "price-desc" | "newest",
    limit: 12
  });

  // Flatten all pages of items
  const allItems = data?.pages.flatMap(page => page.items) || [];

  return (
    <main className="min-h-screen bg-surface flex flex-col">
      {/* Hero Section - Redesigned & Compact */}
      <section className="relative h-[300px] md:h-[400px] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
          style={{ backgroundImage: "url('/images/explore-hero.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/40 to-transparent" />
        
        <div className="relative z-10 w-full px-4 md:px-margin-page">
          <div className="max-w-[1600px] mx-auto">
            <h1 className="font-serif text-4xl md:text-6xl text-white mb-4 animate-in fade-in slide-in-from-left-4 duration-1000">
              The Art of <br /> 
              <span className="italic">Slow Living</span>
            </h1>
            <p className="text-white/80 max-w-lg text-sm md:text-base font-sans leading-relaxed animate-in fade-in slide-in-from-left-2 duration-1000 delay-200">
              Curating the world&apos;s finest handcrafted treasures. <br />
              Each piece is a testament to heritage, patience, and the human hand.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="flex-1 px-4 md:px-margin-page py-8 md:py-16">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row gap-gutter">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0 pr-12">
            <ExploreSidebar />
          </aside>

          {/* Mobile Filter Drawer / Overlay */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-[100] lg:hidden">
              <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                onClick={() => setIsMobileFilterOpen(false)}
              />
              <div className="absolute inset-0 bg-surface p-6 overflow-y-auto animate-in slide-in-from-bottom duration-300">
                <div className="pb-24">
                  <ExploreSidebar 
                    onFilterApplied={() => setIsMobileFilterOpen(false)} 
                    onClose={() => setIsMobileFilterOpen(false)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Infinite Feed */}
          <div className="flex-1 min-w-0">
            <DiscoveryFeed 
              items={allItems}
              isLoading={isLoading}
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
            />
          </div>
        </div>
      </div>

      {/* Mobile Floating Action Button (FAB) - Bottom Left */}
      <button
        onClick={() => setIsMobileFilterOpen(true)}
        className="fixed bottom-6 left-6 z-50 lg:hidden bg-primary text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
      >
        <Filter className="w-6 h-6" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 font-sans font-bold text-sm uppercase tracking-widest whitespace-nowrap">
          Filters
        </span>
      </button>
    </main>
  );
};

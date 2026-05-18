'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Bookmark } from 'lucide-react';
import { ProductCard } from '@/features/explore/components/ProductCard';

interface FavoritesViewProps {
  initialProducts: any[];
}

export function FavoritesView({ initialProducts }: FavoritesViewProps) {
  return (
    <div className="min-h-screen bg-background py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header section */}
        <div className="flex flex-col gap-3 md:gap-4 mb-12 md:mb-16 text-center max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="bg-primary/5 p-3 rounded-full text-primary">
              <Bookmark className="w-6 h-6" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-3xl md:text-display-sm text-primary tracking-tight"
          >
            Saved Objects
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-sans text-sm md:text-base text-on-surface-variant leading-relaxed"
          >
            A personal collection of slow-made, handcrafted artifacts curated by you.
          </motion.p>
        </div>

        {/* Products Grid or Empty State */}
        {initialProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-outline-variant/60 rounded-3xl bg-surface-container-lowest max-w-lg mx-auto text-center"
          >
            <p className="font-serif italic text-base md:text-lg text-on-surface-variant/80 mb-2">
              "No artifacts saved yet."
            </p>
            <p className="font-sans text-xs md:text-sm text-on-surface-variant/60 mb-8 max-w-sm">
              Discover unique craft creations from makers around India, then click Save for Later to save them in your personal shelf.
            </p>
            <Link
              href="/explore"
              className="bg-primary text-white py-3.5 px-8 rounded-full font-sans text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary/90 transition-all shadow-md active:scale-[0.98]"
            >
              Explore slower-made artifacts
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {initialProducts.map((p) => {
              const mapped = {
                id: p.id,
                type: 'product' as const,
                title: p.title || 'Untitled Product',
                author: p.shop?.name || 'Artisan Maker',
                price: `₹${p.price}`,
                image: p.images[0]?.url || '/placeholder.jpg',
              };
              
              return (
                <ProductCard 
                  key={p.id} 
                  product={mapped}
                  className="transition-all duration-300 hover:scale-[1.01]" 
                />
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}

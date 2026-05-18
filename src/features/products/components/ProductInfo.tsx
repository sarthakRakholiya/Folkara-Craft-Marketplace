'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Bookmark, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getSessionData } from '@/features/auth/actions/auth.actions';
import { useFavoriteQuery, useToggleFavoriteMutation } from '../hooks/useFavorite';
import { useAddToCartMutation } from '@/features/cart/hooks/useCart';

interface ProductInfoProps {
  product: {
    id: string;
    title: string;
    price: string;
    description: string;
    maker: {
      name: string;
      shopName: string;
      href: string;
      bio: string;
      imageUrl?: string;
      makerQuote: string;
      establishedYear: number;
    };
    quantity: number;
  };
  initialIsFavorite: boolean;
}

export const ProductInfo = ({ product, initialIsFavorite }: ProductInfoProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const router = useRouter();

  // TanStack Query for favorite status
  const { data: isFavorite } = useFavoriteQuery(product.id, initialIsFavorite);
  const { mutate: toggleFavorite, isPending } = useToggleFavoriteMutation(product.id);
  const { mutate: addToCart, isPending: isAdding } = useAddToCartMutation();

  const handleAddToCart = async () => {
    try {
      const session = await getSessionData();
      if (!session) {
        const nextPath = encodeURIComponent(window.location.pathname);
        router.push(`/auth?next=${nextPath}`);
        return;
      }
      addToCart({ productId: product.id, quantity: 1 });
    } catch (err) {
      console.error('Failed to add item to bag:', err);
    }
  };

  const handleSaveClick = async () => {
    setIsChecking(true);
    try {
      const session = await getSessionData();
      if (!session) {
        // Unauthenticated -> Redirect to login page with encoded next parameter
        const nextPath = encodeURIComponent(window.location.pathname);
        router.push(`/auth?next=${nextPath}`);
        return;
      }
      
      // Authenticated -> Trigger mutation
      toggleFavorite();
    } catch (err) {
      console.error('Failed to verify session status:', err);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="w-full md:w-[40%] flex flex-col gap-6 md:gap-8 sticky top-32 h-fit"
    >
      <div className="flex flex-col gap-1.5 md:gap-2">
        <h1 className="font-serif text-3xl md:text-display-sm text-primary mt-4 md:mt-6 leading-tight">
          {product.title}
        </h1>

        <p className="font-sans text-sm md:text-base text-on-surface-variant">
          by{' '}
          <Link
            className="underline decoration-outline-variant/30 hover:decoration-secondary transition-colors"
            href={product.maker.href}
          >
            {product.maker.shopName}
          </Link>
        </p>

        <p className="font-serif text-2xl md:text-headline-md text-primary mt-4 md:mt-6">
          {product.price}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className={cn(
          "font-sans text-sm md:text-base text-on-surface-variant leading-relaxed transition-all duration-500",
          !isExpanded && "line-clamp-[8]"
        )}>
          {product.description}
        </div>
        {product.description.length > 200 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[10px] font-sans font-bold tracking-widest text-primary hover:text-secondary transition-colors uppercase w-fit"
          >
            {isExpanded ? "Show Less" : "Show More"}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 md:gap-4 pt-2 md:pt-4">
        <button
          onClick={handleAddToCart}
          disabled={isAdding || product.quantity <= 0}
          className="bg-primary text-white py-4 md:py-5 px-8 rounded-full font-sans text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary/90 transition-all active:scale-[0.98] shadow-lg shadow-primary/10 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isAdding ? (
            <Loader2 className="w-[18px] h-[18px] animate-spin text-white" />
          ) : null}
          {product.quantity <= 0 ? "Out of Stock" : "Add to Cart"}
        </button>
        <button 
          onClick={handleSaveClick}
          disabled={isChecking || isPending}
          className="border border-outline-variant text-primary py-4 md:py-5 px-8 rounded-full font-sans text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase hover:bg-surface-container transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isChecking || isPending ? (
            <Loader2 className="w-[18px] h-[18px] animate-spin text-primary" />
          ) : (
            <Bookmark className={cn("w-[18px] h-[18px] text-primary transition-all", isFavorite && "fill-current text-primary")} />
          )}
          {isFavorite ? 'Saved for Later' : 'Save for Later'}
        </button>

        <div className="flex items-center gap-3 justify-center mt-2">
          {product.quantity > 0 ? (
            <>
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </div>
              <span className="font-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em]">
                Only {product.quantity} left from this firing
              </span>
            </>
          ) : (
            <span className="font-sans text-[10px] font-bold text-danger uppercase tracking-[0.15em]">
              Out of Stock
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

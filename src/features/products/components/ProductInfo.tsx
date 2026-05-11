"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface AccordionItemProps {
  title: string;
  content: string;
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionItem = ({ title, content, isOpen, onToggle }: AccordionItemProps) => {
  return (
    <div className="border-b border-outline-variant/30 py-4">
      <button 
        onClick={onToggle}
        className="flex justify-between items-center w-full text-left focus:outline-none"
      >
        <span className="font-label-caps text-xs md:text-sm text-primary tracking-widest uppercase">{title}</span>
        <span className={cn(
          "material-symbols-outlined transition-transform duration-300",
          isOpen && "rotate-180"
        )}>
          expand_more
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pt-4 font-sans text-sm md:text-base text-on-surface-variant leading-relaxed">
              {content}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface ProductInfoProps {
  product: {
    title: string;
    price: string;
    description: string;
    maker: {
      name: string;
      href: string;
    };
    details: {
      materials: string;
      dimensions: string;
      care: string;
    };
  };
}

export const ProductInfo = ({ product }: ProductInfoProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="w-full md:w-[40%] flex flex-col gap-6 md:gap-8 sticky top-32 h-fit">
      <div className="flex flex-col gap-1.5 md:gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-sans text-[9px] md:text-[10px] font-bold tracking-widest uppercase flex items-center gap-1 shadow-sm">
            <span className="material-symbols-outlined text-[12px] md:text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            Matches your aesthetic
          </span>
        </div>
        <h1 className="font-serif text-2xl md:text-4xl text-primary mt-2 md:mt-4 leading-tight">
          {product.title}
        </h1>
        <p className="font-sans text-xs md:text-base text-on-surface-variant">
          by <Link className="underline decoration-outline-variant/30 hover:decoration-secondary transition-colors" href={product.maker.href}>{product.maker.name}</Link>
        </p>
        <p className="font-serif text-xl md:text-2xl text-primary mt-2 md:mt-4">{product.price}</p>
      </div>

      <div className="font-serif text-base md:text-xl text-on-surface leading-relaxed italic border-l-2 border-primary/10 pl-4 md:pl-6 py-1">
        {product.description}
      </div>

      {/* Accordion */}
      <div className="flex flex-col border-t border-outline-variant/30">
        <AccordionItem 
          title="Materials" 
          content={product.details.materials} 
          isOpen={openIndex === 0} 
          onToggle={() => setOpenIndex(openIndex === 0 ? null : 0)} 
        />
        <AccordionItem 
          title="Dimensions" 
          content={product.details.dimensions} 
          isOpen={openIndex === 1} 
          onToggle={() => setOpenIndex(openIndex === 1 ? null : 1)} 
        />
        <AccordionItem 
          title="Care" 
          content={product.details.care} 
          isOpen={openIndex === 2} 
          onToggle={() => setOpenIndex(openIndex === 2 ? null : 2)} 
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 md:gap-4 pt-2 md:pt-4">
        <button className="bg-primary text-white py-3.5 md:py-4 px-8 rounded-full font-sans text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary/90 transition-all active:scale-[0.98]">
          Add to Cart
        </button>
        <button className="border border-outline-variant text-primary py-3.5 md:py-4 px-8 rounded-full font-sans text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase hover:bg-surface-container transition-all flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[16px] md:text-[18px]">bookmark</span>
          Save for Later
        </button>
        <div className="flex items-center gap-2 justify-center mt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
          <span className="font-sans text-[9px] md:text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Only 4 sets left from this firing</span>
        </div>
      </div>
    </div>
  );
};

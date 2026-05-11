"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Editorial } from '../explore.types';
import { cn } from '@/lib/utils';

interface EditorialCardProps {
  editorial: Editorial;
  className?: string;
}

export const EditorialCard = React.memo(({ editorial, className }: EditorialCardProps) => {
  if (editorial.variant === 'image-bg' && editorial.image) {
    return (
      <div className={cn("relative overflow-hidden rounded-xl aspect-[3/4] flex items-end p-8 md:p-10 text-white group cursor-pointer", className)}>
        <div className="absolute inset-0 z-0">
          <Image
            src={editorial.image}
            alt={editorial.title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>
        
        <div className="relative z-10 w-full">
          <h2 className="font-serif text-2xl md:text-3xl mb-6 text-white leading-tight">
            {editorial.title}
          </h2>
          <button className="border border-white/40 hover:bg-white hover:text-primary px-8 py-3 rounded-full font-sans text-xs tracking-[0.15em] uppercase transition-all duration-300">
            {editorial.linkText}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "p-8 md:p-12 rounded-xl flex flex-col justify-center text-center relative overflow-hidden group min-h-[400px]",
      "bg-surface-container-high",
      className
    )}>
      {editorial.image && (
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src={editorial.image}
            alt=""
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-surface-container-high/60" />
        </div>
      )}
      
      <div className="relative z-10 flex flex-col items-center">
        <span className="font-sans text-xs tracking-[0.2em] uppercase text-outline mb-6">
          {editorial.category}
        </span>
        <h2 className="font-serif text-2xl md:text-3xl text-primary mb-6 leading-tight max-w-sm">
          {editorial.title}
        </h2>
        <p className="font-sans text-base text-on-surface-variant mb-10 max-w-xs leading-relaxed">
          {editorial.description}
        </p>
        <Link 
          href="#" 
          className="text-primary underline font-sans text-xs tracking-[0.15em] uppercase decoration-1 underline-offset-8 hover:opacity-70 transition-opacity"
        >
          {editorial.linkText}
        </Link>
      </div>
    </div>
  );
});

EditorialCard.displayName = 'EditorialCard';

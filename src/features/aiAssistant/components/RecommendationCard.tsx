import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface RecommendationCardProps {
  title: string;
  description: string;
  price?: string;
  imageUrl?: string;
  href?: string;
  icon?: string;
  className?: string;
}

export const RecommendationCard = ({
  title,
  description,
  price,
  imageUrl,
  href = "#",
  icon,
  className
}: RecommendationCardProps) => {
  return (
    <div className={cn(
      "group relative flex items-center gap-5 p-3 pr-5 bg-surface/40 backdrop-blur-md border border-outline-variant/10 rounded-[1.5rem] hover:bg-surface-container-low/60 transition-all duration-500 cursor-pointer overflow-hidden shadow-sm hover:shadow-md hover:border-outline-variant/30",
      className
    )}>
      {/* Visual Indicator/Image */}
      <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-inner bg-surface-container">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            width={80}
            height={80}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-secondary/40 scale-125">
              {icon || 'filter_vintage'}
            </span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0 py-1">
        <div className="flex justify-between items-baseline gap-2">
          <h4 className="font-serif text-lg text-primary leading-tight truncate">
            {title}
          </h4>
          {price && (
            <span className="font-sans text-xs font-bold text-secondary shrink-0">
              {price}
            </span>
          )}
        </div>
        <p className="font-sans text-xs text-on-surface-variant/70 italic mt-0.5 line-clamp-1">
          {description}
        </p>
      </div>

      {/* Action Arrow */}
      <div className="w-8 h-8 rounded-full border border-outline-variant/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300">
        <span className="material-symbols-outlined text-sm">
          arrow_forward
        </span>
      </div>
      
      {/* Subtle Link Overlay */}
      <Link href={href} className="absolute inset-0 z-10">
        <span className="sr-only">View {title}</span>
      </Link>
    </div>
  );
};

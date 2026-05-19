"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Store } from "lucide-react";

interface ShopCardProps {
  name: string;
  artisanName: string;
  description: string;
  logoUrl?: string;
  href?: string;
  className?: string;
}

export const ShopCard = ({
  name,
  artisanName,
  logoUrl,
  href = "#",
  className,
}: ShopCardProps) => {
  return (
    <div
      className={cn(
        "group relative flex flex-col items-center justify-between w-[155px] h-[175px] bg-surface-container-lowest/80 border border-outline-variant/15 rounded-t-full rounded-b-2xl hover:bg-surface-container-low hover:border-outline-variant/30 hover:-translate-y-0.5 transition-all duration-500 cursor-pointer overflow-hidden shadow-sm hover:shadow-md flex-shrink-0 snap-start p-3.5 relative",
        className,
      )}
    >
      {/* Upper Archway Window & Circular Logo */}
      <div className="flex flex-col items-center w-full min-w-0 mt-1">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-surface-container border border-outline-variant/15 shrink-0 flex items-center justify-center shadow-md">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={name}
              fill
              sizes="64px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <Store className="w-6 h-6 text-secondary/50" />
          )}
        </div>

        {/* Shop Name in Serif Typography */}
        <h4 className="font-serif text-[12.5px] text-primary leading-snug font-semibold mt-3 text-center truncate w-full px-1 group-hover:text-secondary transition-colors duration-300">
          {name}
        </h4>
        
        {/* Artisan Signature */}
        <span className="font-sans text-[8.5px] text-on-surface-variant/50 font-medium text-center truncate w-full block mt-0.5">
          By {artisanName}
        </span>
      </div>

      {/* Aegean Bottom Pass Arrow */}
      <div className="flex items-center justify-center gap-1.5 mt-2.5 text-primary group-hover:text-secondary transition-colors duration-300 font-sans text-[8.5px] font-bold tracking-widest uppercase shrink-0">
        <span>Visit Studio</span>
        <span className="material-symbols-outlined text-[10px] translate-x-0 group-hover:translate-x-0.5 transition-transform duration-300">
          arrow_forward
        </span>
      </div>

      {/* Invisible overlay Link */}
      <Link href={href} className="absolute inset-0 z-10">
        <span className="sr-only">Visit {name}</span>
      </Link>
    </div>
  );
};

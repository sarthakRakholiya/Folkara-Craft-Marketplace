"use client";

import React, { useEffect, useState } from "react";
import {
  useQueryState,
  parseAsString,
  parseAsInteger,
  parseAsArrayOf,
} from "nuqs";
import { cn } from "@/lib/utils";
import { Filter, RotateCcw, ChevronDown, ChevronUp, X } from "lucide-react";
import { CRAFT_OPTIONS } from "@/features/onboarding/constants/onboarding.constants";
import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

interface ExploreSidebarProps {
  onFilterApplied?: () => void;
  onClose?: () => void;
}

export const ExploreSidebar = ({
  onFilterApplied,
  onClose,
}: ExploreSidebarProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const categoriesList = CRAFT_OPTIONS.map((opt) => opt.category);
  // Show all for GSAP to handle visibility via height/overflow
  const visibleCategories = categoriesList;

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const items = containerRef.current.querySelectorAll(".category-item");
    const hiddenItems = Array.from(items).slice(5);

    if (isExpanded) {
      gsap.to(hiddenItems, {
        height: "auto",
        opacity: 1,
        marginTop: 16,
        duration: 0.4,
        ease: "power2.out",
        stagger: 0.05,
        display: "block",
      });
    } else {
      gsap.to(hiddenItems, {
        height: 0,
        opacity: 0,
        marginTop: 0,
        duration: 0.3,
        ease: "power2.in",
        stagger: {
          each: 0.02,
          from: "end",
        },
        display: "none",
      });
    }
  }, [isExpanded]);
  const [categories, setCategories] = useQueryState(
    "categories",
    parseAsArrayOf(parseAsString)
      .withDefault([])
      .withOptions({ shallow: false }),
  );
  const [minPriceQuery, setMinPriceQuery] = useQueryState(
    "minPrice",
    parseAsInteger.withDefault(0).withOptions({ shallow: false }),
  );
  const [maxPriceQuery, setMaxPriceQuery] = useQueryState(
    "maxPrice",
    parseAsInteger.withDefault(0).withOptions({ shallow: false }),
  );
  const [sort, setSort] = useQueryState(
    "sort",
    parseAsString.withDefault("newest").withOptions({ shallow: false }),
  );

  // Local state for immediate UI feedback during slider drag
  const [localMinPrice, setLocalMinPrice] = useState(minPriceQuery);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPriceQuery);
  const [prevMin, setPrevMin] = useState(minPriceQuery);
  const [prevMax, setPrevMax] = useState(maxPriceQuery);

  // Sync local state if query changes from outside (e.g. Reset or URL change)
  if (minPriceQuery !== prevMin) {
    setPrevMin(minPriceQuery);
    setLocalMinPrice(minPriceQuery);
  }
  if (maxPriceQuery !== prevMax) {
    setPrevMax(maxPriceQuery);
    setLocalMaxPrice(maxPriceQuery);
  }

  // Debounce price updates to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localMinPrice !== minPriceQuery) setMinPriceQuery(localMinPrice);
    }, 400);
    return () => clearTimeout(timer);
  }, [localMinPrice, minPriceQuery, setMinPriceQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localMaxPrice !== maxPriceQuery) setMaxPriceQuery(localMaxPrice);
    }, 400);
    return () => clearTimeout(timer);
  }, [localMaxPrice, maxPriceQuery, setMaxPriceQuery]);

  const handleReset = () => {
    setCategories([]);
    setLocalMinPrice(0);
    setLocalMaxPrice(0);
  };

  const toggleCategory = (cat: string) => {
    const next = categories.includes(cat)
      ? categories.filter((c) => c !== cat)
      : [...categories, cat];
    setCategories(next);
  };

  return (
    <div className="space-y-12 h-full relative">
      {/* Dual Header System */}
      <div className="space-y-4 mb-4 relative">
        {/* Row 1: Main Header + Reset/Close */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Filter className="w-8 h-8" />
            <span className="font-serif text-4xl">Filters</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="text-[10px] font-sans font-bold tracking-widest text-primary/40 hover:text-primary transition-colors flex items-center gap-1 uppercase px-2 py-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sort Order */}
      <div className="space-y-6">
        <h3 className="font-sans font-bold text-[11px] tracking-[0.2em] text-on-surface-variant uppercase">
          Sort By
        </h3>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            onFilterApplied?.();
          }}
          className="w-full bg-surface-container-low border border-outline-variant/10 rounded-lg px-3 py-4 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-primary transition-all cursor-pointer appearance-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 1rem center",
            backgroundSize: "1.5em",
          }}
        >
          <option value="newest">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* Categories */}
      <div className="space-y-6">
        <h3 className="font-sans font-bold text-[11px] tracking-[0.2em] text-on-surface-variant uppercase">
          Categories
        </h3>
        <div className="space-y-4" ref={containerRef}>
          {visibleCategories.map((cat, index) => (
            <div
              key={cat}
              className={cn(
                "category-item overflow-hidden",
                index > 4 && !isExpanded && "hidden h-0 opacity-0 mt-0",
              )}
            >
              <label className="group flex items-center gap-3 cursor-pointer select-none">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={categories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="peer appearance-none w-5 h-5 border border-outline-variant rounded bg-surface-container-low transition-all checked:bg-primary checked:border-primary cursor-pointer"
                  />
                  <svg
                    className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span
                  className={cn(
                    "font-sans text-sm transition-colors",
                    categories.includes(cat)
                      ? "font-bold text-primary"
                      : "text-on-surface-variant group-hover:text-primary",
                  )}
                >
                  {cat}
                </span>
              </label>
            </div>
          ))}

          {categoriesList.length > 5 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-xs font-sans font-bold text-primary hover:text-primary-dark transition-colors pt-2 group"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                  Show {categoriesList.length - 5} More
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-8">
        <h3 className="font-sans font-bold text-[11px] tracking-[0.2em] text-on-surface-variant uppercase">
          Price Range
        </h3>

        <div className="space-y-6">
          {/* Min Price */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] text-on-surface-variant/60 font-bold tracking-widest uppercase">
                Min Price
              </label>
              <span className="text-xs font-sans font-bold text-primary">
                ₹{localMinPrice}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50000"
              step="500"
              value={localMinPrice}
              onChange={(e) => setLocalMinPrice(parseInt(e.target.value))}
              className="w-full accent-primary h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="number"
              value={localMinPrice === 0 ? "" : localMinPrice}
              onChange={(e) => setLocalMinPrice(parseInt(e.target.value) || 0)}
              className="w-full bg-surface-container-low border border-outline-variant/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              placeholder="0"
            />
          </div>

          {/* Max Price */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] text-on-surface-variant/60 font-bold tracking-widest uppercase">
                Max Price
              </label>
              <span className="text-xs font-sans font-bold text-primary">
                ₹{localMaxPrice || "Any"}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100000"
              step="1000"
              value={localMaxPrice || 0}
              onChange={(e) => setLocalMaxPrice(parseInt(e.target.value))}
              className="w-full accent-primary h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="number"
              value={localMaxPrice === 0 ? "" : localMaxPrice}
              onChange={(e) => setLocalMaxPrice(parseInt(e.target.value) || 0)}
              className="w-full bg-surface-container-low border border-outline-variant/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              placeholder="Max Price"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

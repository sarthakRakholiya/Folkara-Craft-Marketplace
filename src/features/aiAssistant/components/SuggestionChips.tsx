import React from 'react';
import { cn } from '@/lib/utils';

interface SuggestionChipsProps {
  chips: string[];
  onChipClick?: (chip: string) => void;
  className?: string;
}

export const SuggestionChips = ({ chips, onChipClick, className }: SuggestionChipsProps) => {
  return (
    <div className={cn("flex gap-2 overflow-x-auto pb-2 scrollbar-hide", className)}>
      {chips.map((chip) => (
        <button
          key={chip}
          onClick={() => onChipClick?.(chip)}
          className="whitespace-nowrap px-4 py-2 bg-surface-container-high/40 text-on-surface-variant rounded-full font-label-caps text-[10px] border border-outline-variant/20 hover:border-secondary/30 hover:bg-secondary/5 transition-all cursor-pointer"
        >
          {chip.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

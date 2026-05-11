"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { useAiSidebar } from '@/features/aiAssistant/hooks/useAiSidebar';

interface AiAssistantFabProps {
  className?: string;
}

export const AiAssistantFab = ({ className }: AiAssistantFabProps) => {
  const { toggle, isOpen } = useAiSidebar();

  return (
    <div className={cn("fixed bottom-margin-page right-margin-page z-50", className)}>
      <button 
        onClick={toggle}
        className={cn(
          "w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-500 group relative overflow-hidden",
          isOpen ? "bg-surface-container-highest text-primary scale-90" : "bg-primary text-white hover:scale-110 active:scale-95"
        )}
      >
        <span className={cn(
          "material-symbols-outlined text-2xl transition-transform duration-500",
          isOpen ? "rotate-90" : "group-hover:animate-pulse"
        )}>
          {isOpen ? 'close' : 'auto_awesome'}
        </span>
        
        {!isOpen && (
          <div className="absolute right-full mr-4 bg-tertiary-fixed text-on-tertiary-fixed py-2 px-4 rounded-lg whitespace-nowrap shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <p className="font-sans italic text-sm">Need help finding something unique?</p>
          </div>
        )}
      </button>
    </div>
  );
};

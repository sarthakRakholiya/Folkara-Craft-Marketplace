"use client";

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useAiSidebar } from '@/features/aiAssistant/hooks/useAiSidebar';
import { motion, AnimatePresence } from 'framer-motion';

interface AiAssistantFabProps {
  className?: string;
}

export const AiAssistantFab = ({ className }: AiAssistantFabProps) => {
  const { toggle, isOpen } = useAiSidebar();
  const [initialTooltipVisible, setInitialTooltipVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (initialTooltipVisible && fabRef.current && !fabRef.current.contains(event.target as Node)) {
        setInitialTooltipVisible(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [initialTooltipVisible]);

  const showTooltip = !isOpen && (initialTooltipVisible || isHovered);

  return (
    <div 
      ref={fabRef} 
      className={cn("fixed bottom-margin-page right-margin-page z-50 flex flex-col items-end", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {showTooltip && (
          <motion.div 
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: [0, -6, 0], // Gentle bouncing
              scale: 1,
            }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ 
              opacity: { duration: 0.2 },
              scale: { type: "spring", stiffness: 300, damping: 20 },
              y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute bottom-full right-0 mb-4 whitespace-nowrap pointer-events-none z-10 origin-bottom-right"
          >
            {/* Tooltip Body */}
            <div className="relative bg-surface text-on-surface py-3 px-5 rounded-2xl shadow-[0_12px_40px_rgba(var(--primary),0.2)] border border-primary/20 flex items-center gap-3">
              <motion.div 
                className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary"
                animate={{ rotate: [0, -15, 15, -15, 15, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
              >
                <span className="material-symbols-outlined text-[18px]">waving_hand</span>
              </motion.div>
              <div className="flex flex-col">
                <span className="font-serif text-sm text-primary font-medium">Hi there!</span>
                <p className="font-sans text-xs text-on-surface-variant">
                  I can help you with anything here
                </p>
              </div>
            </div>
            
            {/* Tooltip Tail/Arrow */}
            <div className="absolute -bottom-1.5 right-[22px] w-3 h-3 bg-surface border-b border-r border-primary/20 rotate-45 shadow-[3px_3px_5px_rgba(0,0,0,0.03)]" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative mt-auto">
        {/* Pulse effect behind the button when tooltip is visible */}
        {showTooltip && (
          <div className="absolute inset-0 rounded-full bg-primary/40 animate-ping pointer-events-none" style={{ animationDuration: '2s' }} />
        )}
        
        <button 
          onClick={() => {
            setInitialTooltipVisible(false);
            toggle();
          }}
          className={cn(
            "w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-500 relative",
            isOpen ? "bg-surface-container-highest text-primary scale-90" : "bg-primary text-white hover:scale-110 active:scale-95"
          )}
        >
          <span className={cn(
            "material-symbols-outlined text-2xl transition-transform duration-500",
            isOpen ? "rotate-90" : "animate-pulse"
          )}>
            {isOpen ? 'close' : 'auto_awesome'}
          </span>
        </button>
      </div>
    </div>
  );
};

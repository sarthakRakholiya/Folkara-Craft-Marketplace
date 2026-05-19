"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const THINKING_PHRASES = [
  "Lore is listening to the stories...",
  "Lore is searching our quiet archives...",
  "Lore is curating slow-made treasures...",
  "Lore is matching your space's character...",
  "Lore is finding the artisan's touch...",
];

interface ThinkingIndicatorProps {
  isThinking: boolean;
}

export const ThinkingIndicator = React.memo(({ isThinking }: ThinkingIndicatorProps) => {
  const [phraseIdx, setPhraseIdx] = React.useState(2);

  useEffect(() => {
    if (!isThinking) return;
    const id = setInterval(
      () => setPhraseIdx((i) => (i + 1) % THINKING_PHRASES.length),
      1000,
    );
    return () => clearInterval(id);
  }, [isThinking]);

  if (!isThinking) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex gap-2.5 items-start max-w-[90%]"
    >
      <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 relative border border-outline-variant bg-surface flex items-center justify-center">
        <Image src="/logo.png" alt="Lore" fill sizes="28px" className="object-contain p-1" />
      </div>
      <div className="flex flex-col gap-0.5 max-w-[calc(100%-2rem)]">
        <span className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant/60 font-bold px-1 mb-0.5">
          Lore
        </span>
        <div className="bg-surface-container-low px-3 py-2 rounded-xl rounded-tl-none border border-outline-variant/10 w-fit flex items-center justify-center min-h-[36px] gap-2.5">
          <div className="flex gap-1 items-center py-0.5 px-0.5 flex-shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" />
          </div>
          <span className="font-sans text-[11px] text-on-surface-variant/70 italic border-l border-outline-variant/30 pl-2 select-none">
            {THINKING_PHRASES[phraseIdx]}
          </span>
        </div>
      </div>
    </motion.div>
  );
});
ThinkingIndicator.displayName = "ThinkingIndicator";

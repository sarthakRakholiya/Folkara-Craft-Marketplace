"use client";

import React, { useEffect, useCallback } from "react";
import { SuggestionChips } from "./SuggestionChips";
import { cn } from "@/lib/utils";

interface AiChatInputAreaProps {
  isLoading: boolean;
  hasReachedLimit: boolean;
  onSend: (text: string) => void;
  onChipClick: (chip: string) => void;
}

export const AiChatInputArea = React.memo(
  ({ isLoading, hasReachedLimit, onSend, onChipClick }: AiChatInputAreaProps) => {
    const [input, setInput] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (!isLoading) {
        const t = setTimeout(() => inputRef.current?.focus(), 50);
        return () => clearTimeout(t);
      }
    }, [isLoading]);

    const handleSubmit = useCallback(
      (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;
        onSend(input.trim());
        setInput("");
      },
      [input, isLoading, onSend],
    );

    return (
      <div className="p-3 md:p-4 pb-4 md:pb-6 space-y-3 bg-surface border-t border-outline-variant/10 shrink-0 relative z-10">
        <SuggestionChips
          chips={[
            "Find ceramic studios",
            "Show my saved treasures",
            "What's in my cart?",
          ]}
          onChipClick={onChipClick}
        />
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading || hasReachedLimit}
            placeholder={
              isLoading
                ? "Thinking..."
                : hasReachedLimit
                  ? "Conversation limit reached."
                  : "Describe what you're looking for..."
            }
            className={cn(
              "w-full bg-surface-container border border-outline-variant/10 rounded-full px-5 py-2.5 font-sans text-[13px] md:text-sm focus:ring-2 focus:ring-primary/10 text-on-surface-variant pr-12 shadow-inner outline-none transition-opacity",
              (isLoading || hasReachedLimit) && "opacity-50 cursor-not-allowed",
            )}
          />
          <button
            type="submit"
            disabled={isLoading || hasReachedLimit || !input.trim()}
            className={cn(
              "absolute right-1 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all",
              (isLoading || hasReachedLimit || !input.trim()) &&
                "opacity-50 grayscale cursor-not-allowed scale-90",
            )}
          >
            <span
              className="material-symbols-outlined scale-75"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {isLoading ? "hourglass_empty" : "send"}
            </span>
          </button>
        </form>
      </div>
    );
  },
);
AiChatInputArea.displayName = "AiChatInputArea";

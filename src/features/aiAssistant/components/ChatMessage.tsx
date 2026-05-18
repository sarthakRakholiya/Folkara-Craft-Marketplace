import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "assistant" | "user";
  content: string | React.ReactNode;
  className?: string;
  isStreaming?: boolean;
  animate?: boolean;
  onType?: () => void;
}

const SmoothTypewriter = ({
  text,
  isStreaming,
  animate,
  onType
}: {
  text: string;
  isStreaming: boolean;
  animate: boolean;
  onType?: () => void;
}) => {
  const [displayedText, setDisplayedText] = useState(animate ? "" : text);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (!animate) {
      setDisplayedText(text);
      return;
    }

    if (!text) {
      setDisplayedText("");
      return;
    }

    const typeNextChar = () => {
      setDisplayedText((prev) => {
        if (prev === text) return prev;
        const diff = text.length - prev.length;
        // Catch-up speed: type faster if we fall behind the active stream buffer
        const charsToAppend = diff > 40 ? 6 : diff > 15 ? 3 : 1; 
        const nextText = prev + text.slice(prev.length, prev.length + charsToAppend);
        if (onType) {
          setTimeout(onType, 0);
        }
        return nextText;
      });
      timerRef.current = setTimeout(typeNextChar, 20); // 20ms typewriter frequency
    };

    if (displayedText !== text) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(typeNextChar, 20);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text, displayedText, animate, onType]);

  const isTyping = (displayedText !== text || isStreaming) && animate;

  return (
    <span className="relative">
      {displayedText}
      {isTyping && (
        <span className="inline-block w-1.5 h-3.5 ml-1 bg-secondary animate-pulse rounded-full align-middle" />
      )}
    </span>
  );
};

export const ChatMessage = ({ role, content, className, isStreaming, animate = false, onType }: ChatMessageProps) => {
  const isAssistant = role === "assistant";

  return (
    <div
      className={cn(
        "flex gap-2.5 items-start",
        isAssistant ? "max-w-[90%] justify-start" : "items-end w-full justify-end",
        className,
      )}
    >
      {isAssistant && (
        <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 relative border border-outline-variant bg-surface flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Lore"
            fill
            sizes="28px"
            className="object-contain p-1"
          />
        </div>
      )}
      <div
        className={cn(
          "flex flex-col gap-0.5",
          isAssistant ? "max-w-[calc(100%-2rem)]" : "items-end max-w-[85%]",
        )}
      >
        {isAssistant && (
          <span className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant/60 font-bold px-1 mb-0.5">
            Lore
          </span>
        )}
        <div
          className={cn(
            "font-sans text-[13px] md:text-sm leading-relaxed break-words whitespace-pre-wrap w-full",
            isAssistant
              ? "bg-surface-container-low px-4 py-2.5 rounded-xl rounded-tl-none text-on-surface"
              : "bg-primary text-white px-4 py-2 rounded-2xl rounded-br-none",
          )}
        >
          {typeof content === "string" ? (
            isAssistant ? (
              <SmoothTypewriter text={content} isStreaming={!!isStreaming} animate={animate} onType={onType} />
            ) : (
              <p>{content}</p>
            )
          ) : (
            content
          )}
        </div>
      </div>
    </div>
  );
};

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "assistant" | "user";
  content: string | React.ReactNode;
  className?: string;
}

export const ChatMessage = ({ role, content, className }: ChatMessageProps) => {
  const isAssistant = role === "assistant";

  return (
    <div
      className={cn(
        "flex gap-3 items-start",
        isAssistant ? "max-w-[90%] justify-start" : "items-end w-full justify-end",
        className,
      )}
    >
      {isAssistant && (
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 relative border border-outline-variant bg-surface flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Lore"
            fill
            sizes="32px"
            className="object-contain p-1"
          />
        </div>
      )}
      <div
        className={cn(
          "flex flex-col gap-1",
          isAssistant ? "max-w-[calc(100%-2.5rem)]" : "items-end max-w-[85%]",
        )}
      >
        {isAssistant && (
          <span className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold px-1 mb-1">
            Lore
          </span>
        )}
        <div
          className={cn(
            "font-sans text-sm md:text-base leading-relaxed break-words whitespace-pre-wrap w-full",
            isAssistant
              ? "bg-surface-container-low p-6 rounded-2xl rounded-tl-none text-on-surface"
              : "bg-primary text-white px-6 py-4 rounded-[2rem] rounded-br-none",
          )}
        >
          {typeof content === "string" ? <p>{content}</p> : content}
        </div>
      </div>
    </div>
  );
};

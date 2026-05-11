import React from 'react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  role: 'assistant' | 'user';
  content: string | React.ReactNode;
  className?: string;
}

export const ChatMessage = ({ role, content, className }: ChatMessageProps) => {
  const isAssistant = role === 'assistant';

  return (
    <div className={cn(
      "flex flex-col gap-3",
      isAssistant ? "max-w-[90%]" : "items-end w-full",
      className
    )}>
      <div className={cn(
        "font-sans text-sm md:text-base leading-relaxed break-words whitespace-pre-wrap",
        isAssistant 
          ? "bg-surface-container-low p-6 rounded-2xl rounded-tl-none text-on-surface" 
          : "bg-primary text-white px-6 py-4 rounded-[2rem] rounded-br-none max-w-[85%]"
      )}>
        {typeof content === 'string' ? <p>{content}</p> : content}
      </div>
    </div>
  );
};

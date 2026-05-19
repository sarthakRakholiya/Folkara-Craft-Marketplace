import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowUpRight, BookOpen, Compass, ShoppingBag, Home as HomeIcon, LogIn } from "lucide-react";

import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  role: "assistant" | "user";
  content: string | React.ReactNode;
  className?: string;
  isStreaming?: boolean;
  animate?: boolean;
  onType?: () => void;
}

const MarkdownRenderer = ({ text, isAssistant }: { text: string; isAssistant: boolean }) => {
  return (
    <div className="whitespace-normal space-y-1 text-left w-full">
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="font-serif text-sm font-bold mt-2.5 mb-1 text-primary" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="font-serif text-[13px] font-bold mt-2 mb-0.5 text-primary" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="font-sans text-[12px] font-bold mt-1.5 mb-0.5 text-on-surface-variant" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className={cn("font-extrabold", isAssistant ? "text-primary" : "text-white")} {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className={cn("italic", isAssistant ? "text-on-surface-variant" : "text-white/80")} {...props} />
          ),
          code: ({ node, ...props }) => (
            <code
              className={cn(
                "px-1.5 py-0.5 border rounded text-[11px] font-mono select-all",
                isAssistant
                  ? "bg-surface-container border-outline-variant/15 text-primary"
                  : "bg-white/10 border-white/10 text-white"
              )}
              {...props}
            />
          ),
          a: ({ node, href, ...props }) => (
            <Link
              href={href || "#"}
              className={cn(
                "underline transition-colors font-medium",
                isAssistant ? "text-primary hover:text-primary-dark" : "text-white hover:text-white/85"
              )}
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-4 space-y-0.5 my-1" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-4 space-y-0.5 my-1" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className={cn("text-[13px] md:text-sm my-0 leading-normal", isAssistant ? "text-on-surface" : "text-white/95")} {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className={cn("text-[13px] md:text-sm leading-relaxed my-0 mb-1 last:mb-0", isAssistant ? "text-on-surface" : "text-white/95")} {...props} />
          ),
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};

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
      {isTyping ? displayedText : <MarkdownRenderer text={text} isAssistant={true} />}
      {isTyping && (
        <span className="inline-block w-1.5 h-3.5 ml-1 bg-secondary animate-pulse rounded-full align-middle" />
      )}
    </span>
  );
};

interface PlatformLink {
  label: string;
  url: string;
  icon: string;
}

const extractPlatformLinks = (text: string): PlatformLink[] => {
  const links: PlatformLink[] = [];
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes("/story") || lowerText.includes("our story") || lowerText.includes("maker story")) {
    links.push({ label: "Our Story", url: "/story", icon: "BookOpen" });
  }
  if (lowerText.includes("/explore") || lowerText.includes("/browse") || lowerText.includes("explore") || lowerText.includes("browse") || lowerText.includes("product page") || lowerText.includes("all products") || lowerText.includes("find product")) {
    links.push({ label: "Explore Crafts", url: "/explore", icon: "Compass" });
  }
  if (lowerText.includes("/cart") || lowerText.includes("shopping bag") || lowerText.includes("shopping cart") || lowerText.includes("checkout") || lowerText.includes("gst")) {
    links.push({ label: "Shopping Bag", url: "/cart", icon: "ShoppingBag" });
  }
  if (lowerText.includes("log in") || lowerText.includes("login") || lowerText.includes("sign in") || lowerText.includes("signin") || lowerText.includes("auth")) {
    links.push({ label: "Sign In", url: "/auth", icon: "LogIn" });
  }
  if (lowerText.includes("home page") || lowerText.includes("folkara home") || (lowerText.includes("homepage") && !lowerText.includes("/story") && !lowerText.includes("/explore") && !lowerText.includes("/cart"))) {
    links.push({ label: "Home Page", url: "/", icon: "Home" });
  }
  
  return links;
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
              <MarkdownRenderer text={content} isAssistant={false} />
            )
          ) : (
            content
          )}
        </div>

        {/* Platform Redirect Quick Tabs */}
        {typeof content === "string" && isAssistant && !isStreaming && (() => {
          const links = extractPlatformLinks(content);
          if (links.length === 0) return null;
          return (
            <div className="flex flex-wrap gap-2 mt-2 pl-1 animate-in fade-in slide-in-from-top-1 duration-300">
              {links.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.url}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/15 text-primary hover:bg-primary hover:text-white transition-all duration-300 font-sans text-[10px] font-bold tracking-wide shadow-sm hover:shadow active:scale-95 cursor-pointer group"
                >
                  {link.icon === "BookOpen" && <BookOpen className="w-3.5 h-3.5" />}
                  {link.icon === "Compass" && <Compass className="w-3.5 h-3.5" />}
                  {link.icon === "ShoppingBag" && <ShoppingBag className="w-3.5 h-3.5" />}
                  {link.icon === "Home" && <HomeIcon className="w-3.5 h-3.5" />}
                  {link.icon === "LogIn" && <LogIn className="w-3.5 h-3.5" />}
                  <span>{link.label}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
};

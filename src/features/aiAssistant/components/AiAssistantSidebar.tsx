"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAiSidebar } from "../hooks/useAiSidebar";
import { ChatMessage } from "./ChatMessage";
import { RecommendationCard } from "./RecommendationCard";
import { SuggestionChips } from "./SuggestionChips";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

const getMessageText = (msg: any): string => {
  if (msg.content) return msg.content;
  if (!msg.parts) return "";
  return msg.parts
    .filter((part: any) => part.type === "text")
    .map((part: any) => part.text)
    .join("");
};

export const AiAssistantSidebar = () => {
  const { isOpen, close } = useAiSidebar();
  const [input, setInput] = React.useState("");

  const {
    messages,
    sendMessage,
    status,
    setMessages,
  } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  const append = (msg: { role: "user"; content: string }) => {
    sendMessage({ text: msg.content });
  };

  const [thinkingText, setThinkingText] = React.useState("Lore is curating slow-made treasures...");
  const chatEndRef = React.useRef<HTMLDivElement>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Auto-focus input when AI finishes responding or when sidebar opens
  useEffect(() => {
    if (!isLoading && isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isOpen]);

  const scrollToBottom = React.useCallback((behavior: "smooth" | "auto" = "auto") => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior,
      });
    }
  }, []);

  const [hasLoadedHistory, setHasLoadedHistory] = React.useState(false);
  const [showClearConfirm, setShowClearConfirm] = React.useState(false);

  const chatLimit = Number(process.env.NEXT_PUBLIC_CHAT_LIMIT) || 25;
  const hasReachedLimit = messages.length >= chatLimit;

  // Close confirmation panel on sidebar close or limit reached
  useEffect(() => {
    if (!isOpen || hasReachedLimit) {
      setShowClearConfirm(false);
    }
  }, [isOpen, hasReachedLimit]);

  // 1. Load chat history from localStorage on initial mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("folkara_chat_history");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
          }
        } catch (e) {
          console.error("Failed to parse saved chat history", e);
        }
      }
      setHasLoadedHistory(true);
    }
  }, [setMessages]);

  // 2. Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (typeof window !== "undefined" && hasLoadedHistory && messages.length > 0) {
      localStorage.setItem("folkara_chat_history", JSON.stringify(messages));
    }
  }, [messages, hasLoadedHistory]);

  // 3. Scroll to bottom when sidebar is opened
  useEffect(() => {
    if (isOpen && messages.length > 0) {
      const timer = setTimeout(() => {
        scrollToBottom("auto");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages.length, scrollToBottom]);

  const isThinking = isLoading && (
    messages.length === 0 ||
    messages[messages.length - 1].role !== "assistant" ||
    getMessageText(messages[messages.length - 1]) === ""
  );

  // Delayed welcome message (500ms) on first open
  useEffect(() => {
    if (isOpen && hasLoadedHistory && messages.length === 0) {
      const timer = setTimeout(() => {
        setMessages([
          {
            id: "welcome",
            role: "assistant" as const,
            parts: [
              {
                type: "text",
                text: "Welcome to Folkara! \n\nI'm Lore. I'm here to share the stories behind our artisans' creations and help you find something truly special.",
              },
            ],
          },
        ]);
        setTimeout(() => scrollToBottom("smooth"), 100);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, hasLoadedHistory, messages.length, setMessages, scrollToBottom]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom(isLoading ? "auto" : "smooth");
  }, [messages, isThinking, isLoading, scrollToBottom]);

  // Cycle thinking phrases while assistant is thinking
  useEffect(() => {
    if (!isThinking) return;

    const phrases = [
      "Lore is listening to the stories...",
      "Lore is searching our quiet archives...",
      "Lore is curating slow-made treasures...",
      "Lore is matching your space's character...",
      "Lore is finding the artisan's touch..."
    ];

    const interval = setInterval(() => {
      setThinkingText((prev) => {
        const currentIndex = phrases.indexOf(prev);
        const nextIndex = (currentIndex + 1) % phrases.length;
        return phrases[nextIndex];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isThinking]);

  const displayedMessages = messages;

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [close]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50"
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-[100dvh] w-full md:w-[450px] lg:w-[500px] bg-surface shadow-2xl z-50 md:rounded-l-[40px] flex flex-col border-l border-outline-variant/20 overflow-hidden"
          >
            {/* Header */}
            <div className="p-3 md:p-4 flex justify-between items-center bg-surface-container-low/30 border-b border-outline-variant/10 shadow-[0_2px_10px_rgba(0,0,0,0.03)] relative z-10 shrink-0">
              <div className="flex items-center gap-2.5">
                <span
                  className="material-symbols-outlined text-secondary animate-pulse text-lg"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  auto_awesome
                </span>
                <div className="flex flex-col">
                  <span className="font-serif text-base md:text-lg text-primary italic leading-none">
                    Lore
                  </span>
                  <span className="font-sans text-[8px] uppercase tracking-widest text-on-surface-variant/70 mt-0.5">
                    The Storyteller
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={() => setShowClearConfirm((prev) => !prev)}
                    title="Clear Conversation"
                    className={cn(
                      "p-1.5 hover:bg-red-500/10 hover:text-red-500 text-on-surface-variant/70 rounded-full transition-colors group",
                      showClearConfirm && "bg-red-500/10 text-red-500"
                    )}
                  >
                    <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">
                      delete
                    </span>
                  </button>
                )}
                <button
                  onClick={close}
                  className="p-1.5 hover:bg-surface-container rounded-full transition-colors group"
                >
                  <span className="material-symbols-outlined text-on-surface-variant text-lg group-hover:rotate-90 transition-transform">
                    close
                  </span>
                </button>
              </div>
            </div>

            {/* Clear Confirmation Panel */}
            <AnimatePresence>
              {showClearConfirm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-red-500/[0.03] border-b border-outline-variant/10 overflow-hidden shrink-0"
                >
                  <div className="p-3 md:p-4 flex items-center justify-between gap-4">
                    <div className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-red-500 text-base md:text-lg mt-0.5 animate-pulse">
                        warning
                      </span>
                      <div className="flex flex-col">
                        <span className="font-sans font-semibold text-[12px] md:text-[13px] text-red-500 leading-tight">
                          Clear chat history?
                        </span>
                        <span className="font-sans text-[10px] md:text-[11px] text-on-surface-variant/80 mt-0.5 leading-tight">
                          This action cannot be reverted.
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowClearConfirm(false)}
                        className="px-2.5 py-1.5 rounded-full hover:bg-surface-container font-sans font-medium text-[10px] md:text-[11px] text-on-surface-variant transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setMessages([]);
                          localStorage.removeItem("folkara_chat_history");
                          setShowClearConfirm(false);
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-red-500 text-white font-sans font-semibold text-[10px] md:text-[11px] hover:bg-red-600 active:scale-95 transition-all shadow-sm"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat Area */}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4 custom-scrollbar">
              <AnimatePresence initial={false}>
                {displayedMessages.map((msg: any) => {
                  const isMessageStreaming = msg.role === "assistant" && isLoading && msg.id === messages[messages.length - 1]?.id;
                  
                  // Hide empty streaming assistant messages to prevent duplicate typing indicators
                  if (msg.role === "assistant" && isMessageStreaming && getMessageText(msg) === "") {
                    return null;
                  }

                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{
                        duration: 0.6,
                        ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for premium feel
                        opacity: { duration: 0.4 },
                      }}
                    >
                      {(() => {
                        return (
                          <>
                            <ChatMessage 
                              role={msg.role as "user" | "assistant"} 
                            content={getMessageText(msg)} 
                            isStreaming={isMessageStreaming}
                            animate={isMessageStreaming}
                            onType={scrollToBottom}
                          />

                          {/* Inline Generative UI Product Cards */}
                          {!isMessageStreaming && msg.parts?.map((part: any, partIdx: number) => {
                            const isSearchProductsTool = 
                              part.type === "tool-searchProducts" || 
                              (part.type === "dynamic-tool" && part.toolName === "searchProducts");
                            
                            if (
                              isSearchProductsTool &&
                              part.state === "output-available" &&
                              Array.isArray(part.output)
                            ) {
                              return (
                                <div
                                  key={part.toolCallId || partIdx}
                                  className="space-y-1.5 mt-2.5 pl-9 md:pl-10 animate-in fade-in slide-in-from-bottom-2 duration-500 w-full"
                                >
                                  <p className="font-sans text-[9px] font-bold tracking-widest text-outline-variant/60 px-1 uppercase mb-1">
                                    Matches your warm earthy style
                                  </p>
                                  <div className="flex gap-3 overflow-x-auto pb-3 pt-1 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full">
                                    {part.output.map((product: any) => (
                                      <RecommendationCard
                                        key={product.id}
                                        title={product.title}
                                        description={product.description}
                                        price={product.price}
                                        imageUrl={product.imageUrl}
                                        href={`/products/${product.id}`}
                                        className="snap-start"
                                      />
                                    ))}
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </>
                      );
                    })()}
                  </motion.div>
                );
              })}

                {isThinking && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-2.5 items-start max-w-[90%]"
                  >
                    <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 relative border border-outline-variant bg-surface flex items-center justify-center">
                      <Image
                        src="/logo.png"
                        alt="Lore"
                        fill
                        sizes="28px"
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5 max-w-[calc(100%-2rem)]">
                      <span className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant/60 font-bold px-1 mb-0.5">
                        Lore
                      </span>
                      <div className="bg-surface-container-low px-3 py-2 rounded-xl rounded-tl-none border border-outline-variant/10 w-fit flex items-center justify-center min-h-[36px] gap-2.5">
                        <div className="flex gap-1 items-center py-0.5 px-0.5 flex-shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce"></div>
                        </div>
                        <span className="font-sans text-[11px] text-on-surface-variant/70 italic border-l border-outline-variant/30 pl-2 select-none">
                          {thinkingText}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={chatEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-3 md:p-4 pb-4 md:pb-6 space-y-3 bg-surface border-t border-outline-variant/10 shrink-0">
              <SuggestionChips
                chips={["Cozy Decor", "Handmade Gifts", "Ceramic Techniques"]}
                onChipClick={(chip) => {
                  append({
                    role: "user",
                    content: chip,
                  });
                }}
              />

              {/* Input Bar */}
              <form
                onSubmit={handleSubmit}
                className="relative flex items-center"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={handleInputChange}
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

            {/* Limit Reached Blur Overlay */}
            <AnimatePresence>
              {hasReachedLimit && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-x-0 bottom-0 top-[65px] md:top-[73px] bg-surface/75 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="bg-surface border border-outline-variant/10 shadow-2xl rounded-3xl p-6 md:p-8 max-w-[85%] flex flex-col items-center gap-4 md:gap-5"
                  >
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-2xl md:text-3xl animate-pulse">
                        forum
                      </span>
                    </div>
                    
                    <div className="space-y-1.5 md:space-y-2">
                      <h3 className="font-serif text-lg md:text-xl text-primary font-semibold">
                        Conversation Limit Reached
                      </h3>
                      <p className="font-sans text-xs text-on-surface-variant/80 px-2 leading-relaxed">
                        You've shared a wonderful conversation of {chatLimit} messages with Lore. To keep the story flowing with perfect accuracy, let's clear this thread and start a fresh chapter!
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setMessages([]);
                        localStorage.removeItem("folkara_chat_history");
                        setShowClearConfirm(false);
                      }}
                      className="w-full py-2.5 px-5 bg-primary text-white font-sans font-semibold text-[13px] md:text-sm rounded-full hover:bg-primary/95 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-base">
                        delete_sweep
                      </span>
                      Clear & Start Fresh
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAiSidebar } from "../hooks/useAiSidebar";
import { ChatMessage } from "./ChatMessage";
import { RecommendationCard } from "./RecommendationCard";
import { SuggestionChips } from "./SuggestionChips";
import { cn } from "@/lib/utils";

export const AiAssistantSidebar = () => {
  const { isOpen, close } = useAiSidebar();
  const [messages, setMessages] = React.useState([
    {
      id: "1",
      role: "assistant" as const,
      content:
        "Welcome to Folkara! \n\nI'm Lore. I'm here to share the stories behind our artisans' creations and help you find something truly special.",
    },
    {
      id: "2",
      role: "user" as const,
      content:
        "I'm looking for a low-profile centerpiece for a dark oak table.",
    },
  ]);
  const [inputValue, setInputValue] = React.useState("");
  const [isThinking, setIsThinking] = React.useState(false);
  const [thinkingText, setThinkingText] = React.useState("Lore is curating slow-made treasures...");
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

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

  const handleSend = () => {
    if (!inputValue.trim() || isThinking) return;

    const newMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: inputValue,
    };

    const phrases = [
      "Lore is listening to the stories...",
      "Lore is curating slow-made treasures...",
      "Lore is finding the artisan's touch...",
      "Lore is matching your space's character...",
      "Lore is searching our quiet archives..."
    ];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    setThinkingText(randomPhrase);

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setIsThinking(true);

    // Mock assistant response after 3 seconds
    setTimeout(() => {
      setIsThinking(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant" as const,
          content:
            "That sounds lovely. For a dark oak table, I'd recommend something with a contrasting texture like unglazed ceramic or a warm metallic finish. Would you like to see some options?",
        },
      ]);
    }, 3000);
  };

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
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
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
            <div className="p-4 md:p-6 flex justify-between items-center bg-surface-container-low/30 border-b border-outline-variant/10 shrink-0">
              <div className="flex items-center gap-3">
                <span
                  className="material-symbols-outlined text-secondary animate-pulse"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  auto_awesome
                </span>
                <div className="flex flex-col">
                  <span className="font-serif text-lg md:text-xl text-primary italic leading-none">
                    Lore
                  </span>
                  <span className="font-sans text-[9px] uppercase tracking-widest text-on-surface-variant/70 mt-0.5">
                    The Storyteller
                  </span>
                </div>
              </div>
              <button
                onClick={close}
                className="p-2 hover:bg-surface-container rounded-full transition-colors group"
              >
                <span className="material-symbols-outlined text-on-surface-variant group-hover:rotate-90 transition-transform">
                  close
                </span>
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 custom-scrollbar">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
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
                    <ChatMessage role={msg.role} content={msg.content} />
                  </motion.div>
                ))}

                {isThinking && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-3 items-start max-w-[90%]"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 relative border border-outline-variant bg-surface flex items-center justify-center">
                      <Image
                        src="/logo.png"
                        alt="Lore"
                        fill
                        sizes="32px"
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex flex-col gap-1 max-w-[calc(100%-2.5rem)]">
                      <span className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold px-1 mb-1">
                        Lore
                      </span>
                      <div className="bg-surface-container-low p-4 rounded-2xl rounded-tl-none border border-outline-variant/10 w-fit flex items-center justify-center min-h-[44px] gap-3">
                        <div className="flex gap-1.5 items-center py-1 px-1 flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-secondary animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-2 h-2 rounded-full bg-secondary animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-2 h-2 rounded-full bg-secondary animate-bounce"></div>
                        </div>
                        <span className="font-sans text-xs text-on-surface-variant/80 italic border-l border-outline-variant/30 pl-3 select-none">
                          {thinkingText}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* AI Recommendations - Only show after initial messages */}
              {messages.length < 5 && !isThinking && (
                <div className="space-y-4">
                  <p className="font-sans text-[10px] font-bold tracking-widest text-outline-variant px-2 uppercase">
                    Matches your warm earthy style
                  </p>

                  <RecommendationCard
                    title="Shallow Clay Dish"
                    description="Hand-burnished terra sigillata"
                    price="₹48.00"
                    imageUrl="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=2070&auto=format&fit=crop"
                  />

                  <RecommendationCard
                    title="Smoked Oak Tray"
                    description="Single-piece carved oak"
                    price="₹65.00"
                    icon="filter_vintage"
                  />
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-4 md:p-6 pb-6 md:pb-8 space-y-4 bg-surface border-t border-outline-variant/10 shrink-0">
              <SuggestionChips
                chips={["Cozy Decor", "Handmade Gifts", "Ceramic Techniques"]}
                onChipClick={(chip) => setInputValue(chip)}
              />

              {/* Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isThinking}
                  placeholder={
                    isThinking
                      ? "Thinking..."
                      : "Describe what you're looking for..."
                  }
                  className={cn(
                    "w-full bg-surface-container border-none rounded-full px-6 md:px-8 py-3 md:py-4 font-sans text-sm md:text-base focus:ring-2 focus:ring-primary/10 text-on-surface-variant pr-14 md:pr-16 shadow-inner outline-none transition-opacity",
                    isThinking && "opacity-50 cursor-not-allowed",
                  )}
                />
                <button
                  type="submit"
                  disabled={isThinking || !inputValue.trim()}
                  className={cn(
                    "absolute right-2 md:right-3 w-8 md:w-10 h-8 md:h-10 bg-primary text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all",
                    (isThinking || !inputValue.trim()) &&
                      "opacity-50 grayscale cursor-not-allowed scale-90",
                  )}
                >
                  <span
                    className="material-symbols-outlined scale-75 md:scale-90"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {isThinking ? "hourglass_empty" : "send"}
                  </span>
                </button>
              </form>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

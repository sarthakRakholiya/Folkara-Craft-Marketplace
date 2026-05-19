"use client";

import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAiSidebar } from "../hooks/useAiSidebar";
import { DrawerShell } from "./DrawerShell";
import { ChatMessage } from "./ChatMessage";
import { ThinkingIndicator } from "./ThinkingIndicator";
import { AiChatInputArea } from "./AiChatInputArea";
import { AiToolOutput } from "./AiToolOutput";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getMessageText = (msg: any): string => {
  if (msg.content) return msg.content;
  if (!msg.parts) return "";
  return msg.parts
    .filter((p: any) => p.type === "text")
    .map((p: any) => p.text)
    .join("");
};

// ─── Sidebar Content ──────────────────────────────────────────────────────────

const SidebarContent = React.memo(() => {
  const { close } = useAiSidebar();

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "submitted" || status === "streaming";
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((behavior: "smooth" | "auto" = "auto") => {
    scrollContainerRef.current?.scrollTo({
      top: scrollContainerRef.current.scrollHeight,
      behavior,
    });
  }, []);

  const [hasLoadedHistory, setHasLoadedHistory] = React.useState(false);
  const [showClearConfirm, setShowClearConfirm] = React.useState(false);

  const chatLimit = Number(process.env.NEXT_PUBLIC_CHAT_LIMIT) || 25;
  const hasReachedLimit = messages.length >= chatLimit;

  const handleSend = useCallback(
    (text: string) => sendMessage({ text }),
    [sendMessage],
  );

  const handleChipClick = useCallback(
    (chip: string) => sendMessage({ text: chip }),
    [sendMessage],
  );

  const handleClear = useCallback(() => {
    setMessages([]);
    localStorage.removeItem("folkara_chat_history");
    setShowClearConfirm(false);
  }, [setMessages]);

  // Load chat history on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("folkara_chat_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed);
      } catch (e) {
        console.error("Failed to parse saved chat history", e);
      }
    }
    setHasLoadedHistory(true);
  }, [setMessages]);

  // Persist messages
  useEffect(() => {
    if (typeof window !== "undefined" && hasLoadedHistory && messages.length > 0) {
      localStorage.setItem("folkara_chat_history", JSON.stringify(messages));
    }
  }, [messages, hasLoadedHistory]);

  // Welcome message on first open
  useEffect(() => {
    if (!hasLoadedHistory || messages.length > 0) return;
    const t = setTimeout(() => {
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
    return () => clearTimeout(t);
  }, [hasLoadedHistory, messages.length, setMessages, scrollToBottom]);

  // Close confirm panel when limit hit
  useEffect(() => {
    if (hasReachedLimit) setShowClearConfirm(false);
  }, [hasReachedLimit]);

  // Auto-scroll
  useEffect(() => {
    scrollToBottom(isLoading ? "auto" : "smooth");
  }, [messages, isLoading, scrollToBottom]);

  const isThinking =
    isLoading &&
    (messages.length === 0 ||
      messages[messages.length - 1].role !== "assistant" ||
      getMessageText(messages[messages.length - 1]) === "");

  return (
    <>
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
              onClick={() => setShowClearConfirm((p) => !p)}
              title="Clear Conversation"
              className={cn(
                "p-1.5 hover:bg-red-500/10 hover:text-red-500 text-on-surface-variant/70 rounded-full transition-colors group",
                showClearConfirm && "bg-red-500/10 text-red-500",
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
                  onClick={handleClear}
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
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4 custom-scrollbar"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg: any) => {
            const isMessageStreaming =
              msg.role === "assistant" &&
              isLoading &&
              msg.id === messages[messages.length - 1]?.id;

            if (isMessageStreaming && getMessageText(msg) === "") return null;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                  opacity: { duration: 0.4 },
                }}
              >
                <ChatMessage
                  role={msg.role as "user" | "assistant"}
                  content={getMessageText(msg)}
                  isStreaming={isMessageStreaming}
                  animate={isMessageStreaming}
                  onType={scrollToBottom}
                />

                {/* Render tool output cards (products, shops, saved items) */}
                {!isMessageStreaming && msg.parts?.length > 0 && (
                  <AiToolOutput parts={msg.parts} />
                )}
              </motion.div>
            );
          })}

          <ThinkingIndicator isThinking={isThinking} />
        </AnimatePresence>
      </div>

      {/* Input */}
      <AiChatInputArea
        isLoading={isLoading}
        hasReachedLimit={hasReachedLimit}
        onSend={handleSend}
        onChipClick={handleChipClick}
      />

      {/* Limit Reached Overlay */}
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
                  You've shared a wonderful conversation of {chatLimit} messages
                  with Lore. To keep the story flowing with perfect accuracy,
                  let's clear this thread and start a fresh chapter!
                </p>
              </div>
              <button
                onClick={handleClear}
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
    </>
  );
});
SidebarContent.displayName = "SidebarContent";

// ─── Public export ────────────────────────────────────────────────────────────

export const AiAssistantSidebar = () => {
  const { isOpen, close } = useAiSidebar();

  return (
    <DrawerShell isOpen={isOpen} onClose={close}>
      <SidebarContent />
    </DrawerShell>
  );
};

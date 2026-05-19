"use client";

import { useQueryState, parseAsBoolean } from "nuqs";

/**
 * Hook to manage the AI Assistant sidebar state via URL search parameters.
 * Uses nuqs with shallow:true for synchronous, flicker-free updates.
 * No local state mirror — single source of truth eliminates the race condition.
 */
export const useAiSidebar = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "ai",
    parseAsBoolean.withDefault(false).withOptions({ shallow: true, history: "replace" })
  );

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return {
    isOpen: isOpen ?? false,
    open,
    close,
    toggle,
  };
};

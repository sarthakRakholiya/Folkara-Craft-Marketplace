"use client";

import { useQueryState, parseAsBoolean } from "nuqs";

/**
 * Hook to manage the AI Assistant sidebar state via URL search parameters.
 * Using nuqs ensures the state is syncable and shareable.
 */
export const useAiSidebar = () => {
  const [isOpen, setIsOpen] = useQueryState(
    "ai",
    parseAsBoolean.withDefault(false).withOptions({ shallow: true })
  );

  const toggle = () => setIsOpen((prev) => !prev);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    isOpen,
    toggle,
    open,
    close,
  };
};

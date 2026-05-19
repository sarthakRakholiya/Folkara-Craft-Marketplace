"use client";
 
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
 
interface DrawerShellProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
 
/**
 * MUI-style Drawer shell.
 * - Always mounted in the DOM (no remount flicker).
 * - Translates in/out with CSS — never destroys children.
 * - Backdrop and scroll-lock live here so the sidebar logic is pure.
 */
export const DrawerShell = React.memo(({ isOpen, onClose, children }: DrawerShellProps) => {
  // Scroll lock
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
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-primary/25 z-50"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
 
      {/*
        The aside is ALWAYS in the DOM.
        We use translateX to slide it in/out — no mount/unmount = no flicker.
      */}
      <aside
        aria-modal="true"
        role="dialog"
        aria-hidden={!isOpen}
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: isOpen
            ? "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), visibility 0s linear 0s"   // open: instant visibility + snappy slide
            : "transform 0.55s cubic-bezier(0.4, 0, 0.2, 1), visibility 0s linear 0.55s", // close: slide first, then hide
          visibility: isOpen ? "visible" : "hidden",
        }}
        className="fixed right-0 top-0 h-[100dvh] w-full md:w-[35vw] bg-surface shadow-2xl z-50 md:rounded-l-[40px] flex flex-col border-l border-outline-variant/20 overflow-hidden will-change-transform"
      >
        {children}
      </aside>
    </>
  );
});
DrawerShell.displayName = "DrawerShell";

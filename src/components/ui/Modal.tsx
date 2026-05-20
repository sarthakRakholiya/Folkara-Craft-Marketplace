"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  maxWidth?: string;
  noPadding?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  showCloseButton = true,
  maxWidth = "max-w-md",
  noPadding = false,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen && mounted) {
      document.body.style.overflow = "hidden";
      
      // Animate In
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
      );
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, mounted]);

  const handleClose = () => {
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
    });
    gsap.to(modalRef.current, {
      opacity: 0,
      scale: 0.95,
      y: 10,
      duration: 0.2,
      ease: "power2.in",
      onComplete: onClose,
    });
  };

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/20 backdrop-blur-md opacity-0"
        onClick={handleClose}
      />

      {/* Modal Card */}
      <div
        ref={modalRef}
        className={cn(
          "relative w-full rounded-[32px] shadow-2xl overflow-hidden z-10 opacity-0 border border-outline/10",
          !className?.includes("bg-") && "bg-white",
          maxWidth,
          className
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className={cn(
            "flex items-center justify-between p-6 pb-0",
            noPadding && "absolute top-2 right-2 z-20 p-0"
          )}>
            {title && (
              <h3 className="font-display-sm text-xl text-primary">{title}</h3>
            )}
            {showCloseButton && (
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-surface-variant/20 text-outline transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className={cn(!noPadding && "p-8 pt-6")}>{children}</div>
      </div>
    </div>,
    document.body
  );
}

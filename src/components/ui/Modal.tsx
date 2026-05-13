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
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  showCloseButton = true,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
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
  }, [isOpen]);

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
          "relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden z-10 opacity-0 border border-outline/10",
          className
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 pb-0">
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
        <div className="p-8 pt-6">{children}</div>
      </div>
    </div>,
    document.body
  );
}

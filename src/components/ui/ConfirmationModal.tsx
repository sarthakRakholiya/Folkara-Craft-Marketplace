"use client";

import React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  icon?: LucideIcon;
  variant?: "primary" | "destructive";
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Keep",
  icon: Icon,
  variant = "primary",
  isLoading = false,
}: ConfirmationModalProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      showCloseButton={false} 
      maxWidth="max-w-[420px]" 
      noPadding 
      className="rounded-[2rem] bg-surface"
    >
      <div className="relative">
        {/* Subtle Decorative Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none paper-texture" />
        
        <div className="relative p-8 flex flex-col items-center text-center">
          {Icon && (
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500",
              variant === "destructive" 
                ? "bg-error/5 text-error border border-error/10" 
                : "bg-primary/5 text-primary border border-primary/10"
            )}>
              <Icon size={28} strokeWidth={1.5} />
            </div>
          )}

          <div className="space-y-2 mb-8">
            <h3 className="font-display-md text-2xl text-primary leading-tight tracking-tight">
              {title}
            </h3>
            <p className="font-body-md text-on-surface-variant/70 text-sm leading-relaxed max-w-[300px] mx-auto">
              {message}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-12 rounded-xl font-label-caps tracking-widest text-[10px] font-bold border-outline-variant/30 text-primary hover:bg-primary/5 transition-all duration-300"
              disabled={isLoading}
            >
              {cancelText.toUpperCase()}
            </Button>
            <Button
              variant={variant === "destructive" ? "destructive" : "primary"}
              onClick={onConfirm}
              className={cn(
                "h-12 rounded-xl font-label-caps tracking-widest text-[10px] font-bold shadow-lg transition-all duration-300",
                variant === "destructive" ? "bg-error text-white shadow-error/20" : "shadow-primary/10"
              )}
              disabled={isLoading}
            >
              {isLoading ? "WAIT..." : confirmText.toUpperCase()}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

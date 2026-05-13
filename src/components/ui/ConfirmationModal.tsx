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
  cancelText = "Cancel",
  icon: Icon,
  variant = "primary",
  isLoading = false,
}: ConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false} className="max-w-[380px] p-0">
      <div className="relative overflow-hidden">
        {/* Decorative Background Element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-surface-bright/50 to-transparent pointer-events-none" />
        
        <div className="relative flex flex-col items-center text-center p-10 pt-12 space-y-8">
          {Icon && (
            <div className="relative group">
              {/* Outer Glow */}
              <div className={cn(
                "absolute inset-0 blur-2xl opacity-20 transition-all duration-500 group-hover:opacity-40",
                variant === "destructive" ? "bg-error" : "bg-primary"
              )} />
              
              {/* Icon Container */}
              <div className={cn(
                "relative w-20 h-20 rounded-[28px] flex items-center justify-center border transition-transform duration-500 group-hover:scale-105",
                variant === "destructive" 
                  ? "bg-error/5 border-error/10 text-error shadow-[0_0_40px_rgba(var(--error-rgb),0.1)]" 
                  : "bg-primary/5 border-primary/10 text-primary shadow-[0_0_40px_rgba(var(--primary-rgb),0.1)]"
              )}>
                <Icon size={36} strokeWidth={1.5} />
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="font-display-sm text-3xl tracking-tight text-primary">{title}</h3>
            <p className="font-body-md text-outline/80 leading-relaxed max-w-[280px] mx-auto">
              {message}
            </p>
          </div>

          <div className="flex flex-col w-full gap-3 pt-4">
            <Button
              variant={variant === "destructive" ? "destructive" : "primary"}
              shape="full"
              onClick={onConfirm}
              className="w-full h-14 font-label-caps tracking-[0.2em] text-[11px] font-black shadow-lg shadow-primary/10"
              disabled={isLoading}
            >
              {isLoading ? "PROCESSING..." : confirmText.toUpperCase()}
            </Button>
            <Button
              variant="outline"
              shape="full"
              onClick={onClose}
              className="w-full h-14 font-label-caps tracking-[0.2em] text-[11px] font-black border-outline/10 hover:bg-surface-bright"
              disabled={isLoading}
            >
              {cancelText.toUpperCase()}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

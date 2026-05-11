"use client";

import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { cn } from "@/lib/utils";

interface FormTextareaProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  className?: string;
  textareaClassName?: string;
  rows?: number;
  disabled?: boolean;
  variant?: "default" | "underlined";
}

export function FormTextarea<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  className,
  textareaClassName,
  rows = 4,
  disabled,
  variant = "default",
}: FormTextareaProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className={cn("space-y-3 w-full", className)}>
          {label && (
            <label 
              htmlFor={name}
              className="text-[10px] tracking-widest font-semibold uppercase text-on-surface-variant block px-1"
            >
              {label}
            </label>
          )}
          
          <div className="relative">
            <textarea
              {...field}
              id={name}
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
              className={cn(
                "w-full transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-on-surface-variant/40 resize-none",
                variant === "default" && "bg-surface-container-low border rounded-xl py-4 px-4 text-sm focus:ring-2",
                variant === "underlined" && "bg-transparent border-b-2 rounded-none py-4 px-0",
                error 
                  ? "border-error focus:ring-error/10 focus:border-error" 
                  : (variant === "default" ? "border-surface-container-highest/50 focus:ring-primary/10 focus:border-primary" : "border-outline-variant focus:border-primary"),
                textareaClassName
              )}
            />
          </div>

          {error && (
            <p className="text-[10px] text-error font-semibold px-1 animate-in fade-in slide-in-from-top-1">
              {error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}

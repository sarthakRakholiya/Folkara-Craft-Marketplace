"use client";

import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { cn } from "@/lib/utils";

interface FormSwitchProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  description?: string;
  className?: string;
}

export function FormSwitch<T extends FieldValues>({
  control,
  name,
  label,
  description,
  className,
}: FormSwitchProps<T>) {
  return (
    <div className={cn("flex items-center justify-between gap-4 w-full", className)}>
      {(label || description) && (
        <div className="flex flex-col gap-1">
          {label && (
            <label 
              htmlFor={name}
              className="font-sans text-sm font-bold text-on-surface cursor-pointer"
            >
              {label}
            </label>
          )}
          {description && (
            <span className="text-[10px] text-on-surface-variant max-w-[280px] leading-tight">
              {description}
            </span>
          )}
        </div>
      )}
      
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange } }) => (
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input 
              type="checkbox"
              checked={value}
              onChange={(e) => onChange(e.target.checked)}
              className="sr-only peer"
              id={name}
            />
            <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary transition-colors shadow-sm"></div>
          </label>
        )}
      />
    </div>
  );
}

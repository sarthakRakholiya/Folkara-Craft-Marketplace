"use client";

import { useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormInputProps<T extends FieldValues> {
  control: any;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  type?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  variant?: "default" | "underlined";
  size?: "sm" | "md" | "lg";
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  startIcon,
  endIcon,
  className,
  inputClassName,
  disabled,
  variant = "default",
  size = "md",
  onFocus,
  onChange,
}: FormInputProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

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

          <div className="relative flex items-center">
            {startIcon && (
              <div className="absolute left-4 text-on-surface-variant/50">
                {startIcon}
              </div>
            )}

            <input
              {...field}
              value={field.value ?? ""}
              id={name}
              type={inputType}
              placeholder={placeholder}
              disabled={disabled}
              onFocus={onFocus}
              onChange={(e) => {
                if (type === "number") {
                  // Remove leading zeros for cleaner number input
                  let val = e.target.value.replace(/^0+/, "");
                  if (val === "" && e.target.value.startsWith("0")) {
                    val = "0";
                  }
                  e.target.value = val;
                }
                onChange?.(e);
                field.onChange(e);
              }}
              className={cn(
                "w-full transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-on-surface-variant/40",
                variant === "default" &&
                  "bg-surface-container-low border rounded-lg py-3 text-sm focus:ring-2",
                variant === "underlined" &&
                  "bg-transparent border-b-2 rounded-none py-4 text-center",
                size === "lg" && "text-2xl md:text-4xl",
                size === "md" && "text-sm",
                size === "sm" && "text-xs",
                error
                  ? "border-error focus:ring-error/10 focus:border-error"
                  : variant === "default"
                    ? "border-surface-container-highest/50 focus:ring-primary/10 focus:border-primary"
                    : "border-outline-variant focus:border-primary",
                startIcon
                  ? "pl-11"
                  : variant === "underlined"
                    ? "px-0"
                    : "pl-4",
                endIcon || isPassword
                  ? "pr-11"
                  : variant === "underlined"
                    ? "px-0"
                    : "pr-4",
                startIcon && "!pl-10",
                inputClassName,
              )}
            />

            <div className="absolute right-4 flex items-center gap-2">
              {isPassword && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={cn(
                    "transition-colors cursor-pointer",
                    error
                      ? "text-error/70 hover:text-error"
                      : "text-on-surface-variant/50 hover:text-primary",
                  )}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
              {endIcon && (
                <div
                  className={cn(
                    error ? "text-error/70" : "text-on-surface-variant/50",
                  )}
                >
                  {endIcon}
                </div>
              )}
            </div>
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

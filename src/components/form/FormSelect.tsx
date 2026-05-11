"use client";

import React from "react";
import Select, { GroupBase, Props } from "react-select";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { cn } from "@/lib/utils";

interface FormSelectProps<T extends FieldValues, Option = { value: string; label: string }, IsMulti extends boolean = false, Group extends GroupBase<Option> = GroupBase<Option>> extends Omit<Props<Option, IsMulti, Group>, 'name'> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  className?: string;
  variant?: "default" | "underlined";
}

export function FormSelect<T extends FieldValues, Option = { value: string; label: string }, IsMulti extends boolean = false, Group extends GroupBase<Option> = GroupBase<Option>>({
  control,
  name,
  label,
  placeholder,
  className,
  variant = "default",
  ...props
}: FormSelectProps<T, Option, IsMulti, Group>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
        <div className={cn("space-y-3 w-full", className)}>
          {label && (
            <label 
              htmlFor={name}
              className="text-[10px] tracking-widest font-bold uppercase text-on-surface-variant block px-1"
            >
              {label}
            </label>
          )}
          
          <Select
            {...props}
            ref={ref}
            instanceId={name}
            value={props.options?.find((option: any) => option.value === value) || null}
            onChange={(val: any) => onChange(val?.value)}
            onBlur={onBlur}
            placeholder={placeholder}
            styles={{
              control: (base, state) => ({
                ...base,
                backgroundColor: "var(--color-surface-container-low)",
                border: variant === "default" 
                  ? `1px solid ${error ? "var(--color-error)" : (state.isFocused ? "var(--color-primary)" : "color-mix(in srgb, var(--color-surface-container-highest), transparent 50%)")}`
                  : "none",
                borderBottom: variant === "underlined" 
                  ? `2px solid ${error ? "var(--color-error)" : (state.isFocused ? "var(--color-primary)" : "var(--color-outline-variant)")}` 
                  : variant === "default" ? base.borderBottom : "none",
                borderRadius: variant === "default" ? "12px" : "0",
                minHeight: "48px",
                boxShadow: state.isFocused ? "0 0 0 2px var(--color-primary-container)" : "none",
                padding: "0 8px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "var(--color-primary)",
                }
              }),
              valueContainer: (base) => ({
                ...base,
                padding: variant === "underlined" ? "0" : "0 8px",
              }),
              singleValue: (base) => ({
                ...base,
                color: "var(--color-on-surface)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.875rem",
              }),
              placeholder: (base) => ({
                ...base,
                color: "color-mix(in srgb, var(--color-on-surface-variant), transparent 60%)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.875rem",
                marginLeft: variant === "underlined" ? "0" : "2px",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "var(--color-surface)",
                borderRadius: "16px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
                border: "1px solid var(--color-outline-variant)",
                overflow: "hidden",
                zIndex: 50,
                marginTop: "8px",
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected ? "var(--color-primary)" : (state.isFocused ? "var(--color-surface-container-low)" : "transparent"),
                color: state.isSelected ? "#FFFFFF" : "var(--color-on-surface)",
                cursor: "pointer",
                fontSize: "0.875rem",
                padding: "12px 16px",
                "&:active": {
                  backgroundColor: "var(--color-primary)",
                  color: "#FFFFFF",
                }
              }),
              indicatorSeparator: () => ({ display: "none" }),
              dropdownIndicator: (base) => ({
                ...base,
                color: "var(--color-on-surface-variant)",
                "&:hover": { color: "var(--color-primary)" }
              }),
            }}
          />

          {error && (
            <p className="text-[10px] text-error font-bold px-1 uppercase tracking-widest">
              {error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}

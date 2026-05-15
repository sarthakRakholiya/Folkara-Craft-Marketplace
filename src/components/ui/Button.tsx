import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "fixed" | "accent" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
  shape?: "square" | "rounded" | "full";
  href?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", shape = "square", href, startIcon, endIcon, loading, children, ...props }, ref) => {
    // ... existing variants/sizes/shapes ...
    const variants = {
      primary: "bg-primary text-white hover:bg-secondary hover:text-white shadow-sm",
      secondary: "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground shadow-sm",
      outline: "border border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40",
      ghost: "text-primary hover:bg-primary/10",
      accent: "bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground",
      fixed: "bg-primary-fixed text-primary hover:bg-white hover:text-primary",
      destructive: "border border-error text-error hover:bg-error hover:text-white",
    };

    const sizes = {
      sm: "px-4 py-2 text-[10px] tracking-widest",
      md: "px-8 py-3.5 text-xs tracking-widest",
      lg: "px-10 py-4 text-xs tracking-widest",
      icon: "p-2",
    };

    const shapes = {
      square: "rounded-none",
      rounded: "rounded-lg",
      full: "rounded-full",
    };

    const commonClasses = cn(
      "inline-flex items-center justify-center font-sans font-semibold uppercase transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] gap-2",
      variants[variant],
      sizes[size],
      shapes[shape],
      className
    );

    const content = (
      <>
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {children}
          </span>
        ) : (
          <>
            {startIcon && <span className="inline-flex shrink-0 [&>svg]:w-[1.2em] [&>svg]:h-[1.2em]">{startIcon}</span>}
            {children}
            {endIcon && <span className="inline-flex shrink-0 [&>svg]:w-[1.2em] [&>svg]:h-[1.2em]">{endIcon}</span>}
          </>
        )}
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          className={commonClasses}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={commonClasses}
        disabled={loading || props.disabled}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };

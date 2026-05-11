import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "fixed" | "accent";
  size?: "sm" | "md" | "lg" | "icon";
  shape?: "square" | "rounded" | "full";
  href?: string;
}

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", shape = "square", href, ...props }, ref) => {
    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground shadow-sm",
      secondary: "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground shadow-sm",
      outline: "border border-primary text-primary hover:bg-primary hover:text-primary-foreground",
      ghost: "text-primary hover:bg-primary/10",
      accent: "bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground",
      fixed: "bg-primary-fixed text-primary hover:bg-white hover:text-primary",
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
      "inline-flex items-center justify-center font-sans font-semibold uppercase transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
      variants[variant],
      sizes[size],
      shapes[shape],
      className
    );

    if (href) {
      return (
        <Link
          href={href}
          className={commonClasses}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {props.children}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={commonClasses}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };

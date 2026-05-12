"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

interface AuthTabsProps {
  mode: "signup" | "login";
  setMode: (mode: "signup" | "login") => void;
  role: "artisan" | "buyer";
  setRole: (role: "artisan" | "buyer") => void;
}

export function AuthTabs({ mode, setMode, role, setRole }: AuthTabsProps) {
  const roleIndicatorRef = useRef<HTMLDivElement>(null);
  const modeIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate Role Indicator
    if (roleIndicatorRef.current) {
      gsap.to(roleIndicatorRef.current, {
        x: role === "buyer" ? "0%" : "100%",
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, [role, mode]);

  useEffect(() => {
    // Animate Mode Indicator
    if (modeIndicatorRef.current) {
      gsap.to(modeIndicatorRef.current, {
        x: mode === "login" ? "0%" : "100%",
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, [mode]);

  return (
    <div className="space-y-8 mb-8">
      {/* Mode Tabs */}
      <div className="relative border-b border-surface-container-highest/50 flex">
        <div
          ref={modeIndicatorRef}
          className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-primary"
        />
        <button
          onClick={() => setMode("login")}
          className={cn(
            "flex-1 pb-3 text-[10px] tracking-widest font-semibold uppercase transition-colors duration-300 cursor-pointer",
            mode === "login"
              ? "text-primary"
              : "text-on-surface-variant hover:text-on-surface",
          )}
        >
          Login
        </button>
        <button
          onClick={() => setMode("signup")}
          className={cn(
            "flex-1 pb-3 text-[10px] tracking-widest font-semibold uppercase transition-colors duration-300 cursor-pointer",
            mode === "signup"
              ? "text-primary"
              : "text-on-surface-variant hover:text-on-surface",
          )}
        >
          Sign Up
        </button>
      </div>

      {/* Role Toggle */}
      {mode === "signup" && (
        <div className="flex w-full justify-center">
          <div className="relative inline-flex p-1 bg-surface-container-high rounded-full w-full overflow-hidden">
            <div
              ref={roleIndicatorRef}
              className="absolute top-1 left-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm"
            />
            <button
              onClick={() => setRole("buyer")}
              className={cn(
                "relative flex-1 px-6 py-2 rounded-full text-[10px] tracking-widest font-semibold uppercase transition-colors duration-300 cursor-pointer",
                role === "buyer"
                  ? "text-primary"
                  : "text-on-surface-variant hover:text-on-surface",
              )}
            >
              Buyer
            </button>
            <button
              onClick={() => setRole("artisan")}
              className={cn(
                "relative flex-1 px-6 py-2 rounded-full text-[10px] tracking-widest font-semibold uppercase transition-colors duration-300 cursor-pointer",
                role === "artisan"
                  ? "text-primary"
                  : "text-on-surface-variant hover:text-on-surface",
              )}
            >
              Artisan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

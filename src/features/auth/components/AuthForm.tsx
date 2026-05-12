"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { useQueryState, parseAsStringEnum } from "nuqs";
import { gsap } from "gsap";
import { AuthHeader } from "./AuthHeader";
import { AuthTabs } from "./AuthTabs";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { cn } from "@/lib/utils";
import { CustomSvg } from "@/components/shared/CustomSvg";

type AuthRole = "artisan" | "buyer";
type AuthMode = "signup" | "login";

export function AuthForm() {
  const [role, setRole] = useQueryState(
    "role",
    parseAsStringEnum<AuthRole>(["buyer", "artisan"]).withDefault("buyer"),
  );

  const [mode, setMode] = useQueryState(
    "mode",
    parseAsStringEnum<AuthMode>(["signup", "login"]).withDefault("login"),
  );

  const formContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate form switch
    if (formContainerRef.current) {
      gsap.fromTo(
        formContainerRef.current,
        { opacity: 0, x: mode === "login" ? 20 : -20 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
      );
    }
  }, [mode]);

  return (
    <div className="w-full max-w-[440px]">
      <AuthHeader mode={mode} role={role} />

      <AuthTabs mode={mode} setMode={setMode} role={role} setRole={setRole} />

      <div ref={formContainerRef}>
        {mode === "login" ? (
          <LoginForm role={role} />
        ) : (
          <SignupForm role={role} />
        )}
      </div>

      {/* Divider */}
      <div className="relative my-8 flex items-center">
        <div className="flex-grow border-t border-surface-container-highest/50" />
        <span className="mx-4 text-[10px] text-on-surface-variant uppercase tracking-widest">
          or continue with
        </span>
        <div className="flex-grow border-t border-surface-container-highest/50" />
      </div>

      {/* Social Logins */}
      <div className="mb-10">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-outline-variant rounded-full hover:bg-surface-container-high transition-colors duration-300 cursor-pointer group"
        >
          <CustomSvg
            name="google"
            size={18}
            className="opacity-70 group-hover:opacity-100 transition-opacity"
          />
          <span className="text-[10px] tracking-widest font-semibold uppercase text-on-surface-variant">
            Continue with Google
          </span>
        </button>
      </div>

      {/* Page Footer */}
      <footer className="text-center space-y-4">
        <p className="text-xs text-on-surface-variant">
          By joining, you agree to our{" "}
          <Link href="#" className="underline hover:text-primary">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="#" className="underline hover:text-primary">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="pt-4 border-t border-surface-container-highest/30 flex justify-center gap-6">
          <span className="text-[10px] font-semibold text-on-surface-variant/60 uppercase tracking-widest">
            © 2026 Folkara
          </span>
          <Link
            href="#"
            className="text-[10px] font-semibold text-on-surface-variant/60 hover:text-primary uppercase tracking-widest"
          >
            Support
          </Link>
        </div>
      </footer>
    </div>
  );
}

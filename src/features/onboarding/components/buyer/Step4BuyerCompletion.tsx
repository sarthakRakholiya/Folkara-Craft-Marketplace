"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Check, Sparkles, Loader2 } from "lucide-react";
import { finalizeOnboarding } from "../../actions/onboarding.action";
import { useRouter, useSearchParams } from "next/navigation";

export const Step4BuyerCompletion = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const [isFinishing, setIsFinishing] = useState(false);

  const handleComplete = async () => {
    setIsFinishing(true);
    try {
      const result = await finalizeOnboarding("BUYER");
      if ("success" in result) {
        router.push(nextParam || "/buyer/overview");
      }
    } catch (error) {
      console.error("Failed to finalize onboarding:", error);
    } finally {
      setIsFinishing(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-2 md:py-4">
      <div className="text-center space-y-4 md:space-y-6">
        {/* Hero Section */}
        <div className="relative w-full aspect-[21/10] md:aspect-[21/8] overflow-hidden rounded-xl shadow-xl shadow-primary/5 group max-w-2xl mx-auto">
          <img
            alt="Artisan workspace"
            className="w-full h-full object-cover grayscale-[20%] transition-transform duration-1000 group-hover:scale-105"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkXftq-iY-PUZrhEETLqcjfiyrlB3KgrHXFcdbrCXGlG8oQfzqwMR8nPs-ookMQZaHjkDuF3UjX_n9J69fYSEaZok8NdiJ3mlxmJ7e0gmPQ7DH6uHsC-4MgYjp0aXU-qERo4igVUhjgo1OzfYKMl4MEdUX8eG81XVhsK916ptyETZKfsXCM6QzDTmER6CEiMTE4SKDI_1zIhciLB5T6dkboIHeF9ZyqAWSaAJxl_fTWkuc3U_CH91aq5PuAmJjaaETEoNW2yY8bm4"
          />
          <div className="absolute inset-0 bg-primary/5" />

          {/* Maker's Mark Badge - macOS Liquified Style */}
          <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-8 bg-white/40 p-5 md:p-7 rounded-full shadow-2xl border border-white/40 flex flex-col items-center justify-center backdrop-blur-3xl z-10 scale-90 md:scale-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
            {/* Liquified Background Effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 via-secondary/10 to-transparent opacity-60 -z-10 animate-pulse" />

            <div className="relative">
              <div className="relative border-2 border-white/60 p-3 md:p-4 rounded-full bg-white/20 shadow-inner">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-secondary to-secondary-container flex items-center justify-center shadow-lg shadow-secondary/30 border border-white/20">
                  <Check
                    className="text-white w-5 h-5 md:w-6 md:h-6"
                    strokeWidth={4}
                  />
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-col items-center">
              <p className="text-[10px] md:text-[11px] text-on-surface font-black tracking-[0.3em] uppercase leading-none text-secondary">
                MAKER
              </p>
              <div className="h-[1px] w-8 bg-secondary/20 my-1" />
              <p className="text-[8px] md:text-[9px] text-on-surface-variant font-bold tracking-[0.1em] uppercase">
                CERTIFIED
              </p>
            </div>
          </div>
        </div>

        {/* Copy Section */}
        <div className="space-y-2 md:space-y-3 pt-2">
          <h1 className="font-serif text-2xl md:text-4xl text-primary max-w-2xl mx-auto leading-tight">
            Your journey begins here.
          </h1>
          <p className="text-xs md:text-base text-on-surface-variant max-w-lg mx-auto italic leading-relaxed opacity-80">
            Your space is ready. We’ve curated stories and objects that speak to
            your aesthetic. Welcome to Folkara.
          </p>
        </div>

        {/* AI Guide / Personalized Note */}
        <div className="bg-surface-container-low p-4 md:p-5 rounded-xl max-w-sm mx-auto relative border-l-2 border-secondary shadow-sm">
          <div className="flex items-start gap-3 text-left">
            <Sparkles className="text-secondary w-4 h-4 mt-1 shrink-0" />
            <div>
              <p className="font-serif text-sm md:text-base italic text-secondary mb-1">
                A note for you...
              </p>
              <p className="text-[10px] md:text-xs text-on-surface-variant leading-tight">
                We've selected makers based on your interests. They are waiting
                for you inside.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 md:pt-4 flex flex-col items-center gap-3">
          <Button
            size="md"
            shape="full"
            onClick={handleComplete}
            disabled={isFinishing}
            className="px-10 md:px-12 py-5 text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/10 transition-all hover:scale-[1.02] w-full sm:w-auto min-w-[200px]"
          >
            {isFinishing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Enter Folkara"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

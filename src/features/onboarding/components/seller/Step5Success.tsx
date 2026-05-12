"use client";

import React from "react";
import {
  Package,
  CreditCard,
  Building2,
  Leaf,
  Edit3,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { finalizeOnboarding } from "../../actions/onboarding.action";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const Step5Success = () => {
  const router = useRouter();
  const [isFinishing, setIsFinishing] = useState(false);

  const handleComplete = async (targetPath: string) => {
    setIsFinishing(true);
    try {
      const result = await finalizeOnboarding("SELLER");
      if (result.success) {
        router.push(targetPath);
      }
    } catch (error) {
      console.error("Failed to finalize onboarding:", error);
    } finally {
      setIsFinishing(false);
    }
  };
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center gap-6 md:gap-8">
      {/* Content Canvas */}
      <div className="space-y-4">
        <h1 className="font-serif text-3xl md:text-5xl text-primary tracking-tight">
          Your shop is ready
        </h1>
        <p className="font-sans text-sm md:text-base text-on-surface-variant max-w-md mx-auto leading-relaxed">
          You can start adding products anytime. We've prepared your digital
          workshop to showcase the intentional craft you bring to the world.
        </p>
      </div>

      {/* Soft Checklist Card - Compact Version */}
      <div className="w-full bg-surface-container-low rounded-2xl p-6 md:p-8 text-left relative overflow-hidden shadow-sm border border-surface-container-highest/50">
        <div className="absolute -top-4 -right-4 p-4 opacity-5 pointer-events-none rotate-12">
          <Leaf className="text-primary w-20 h-20 md:w-24 md:h-24" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {/* Item 1 */}
          <div className="flex md:flex-col gap-4 items-start md:items-center md:text-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Package className="text-primary w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="font-serif text-sm font-semibold text-on-surface">
                Add first product
              </h3>
              <p className="font-sans text-[11px] text-on-surface-variant leading-tight">
                Tell your product's unique story.
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex md:flex-col gap-4 items-start md:items-center md:text-center">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
              <CreditCard className="text-secondary w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="font-serif text-sm font-semibold text-on-surface">
                Set pricing
              </h3>
              <p className="font-sans text-[11px] text-on-surface-variant leading-tight">
                Value your labor and process.
              </p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex md:flex-col gap-4 items-start md:items-center md:text-center">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
              <Building2 className="text-accent-foreground w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="font-serif text-sm font-semibold text-on-surface">
                Payout details
              </h3>
              <p className="font-sans text-[11px] text-on-surface-variant leading-tight">
                Connect your bank account.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Guide Handwritten Note Interaction */}
      <div className="py-2">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-surface-container-low rounded-xl border-b-2 border-secondary-container/40 shadow-sm">
          <Edit3 className="text-tertiary w-5 h-5 opacity-70" />
          <span className="font-serif italic text-tertiary text-opacity-90 text-lg md:text-xl">
            "A slow beginning makes for a lasting legacy."
          </span>
        </div>
      </div>

      {/* Primary CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
        <Button
          size="lg"
          shape="full"
          variant="primary"
          disabled={isFinishing}
          onClick={() => handleComplete("/seller/dashboard/products/new")}
          className="px-10 py-6 w-full sm:w-auto shadow-xl shadow-primary/20 font-sans text-xs font-bold uppercase tracking-widest"
        >
          {isFinishing ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            "Create Listing"
          )}
        </Button>
        <button
          disabled={isFinishing}
          onClick={() => handleComplete("/seller/dashboard")}
          className="px-8 py-4 font-sans text-[11px] font-bold text-on-surface-variant uppercase tracking-widest hover:text-primary transition-all flex items-center gap-2 group disabled:opacity-50"
        >
          {isFinishing ? "Processing..." : "Go To Dashboard"}
          {!isFinishing && (
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          )}
        </button>
      </div>
    </div>
  );
};

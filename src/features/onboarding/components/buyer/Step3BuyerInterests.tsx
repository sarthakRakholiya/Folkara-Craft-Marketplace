"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { CRAFT_OPTIONS } from "../../constants/onboarding.constants";
import { BuyerProfileSchema } from "../../schemas/buyer.schema";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step3BuyerInterestsProps {
  onContinue: () => void;
  onBack: () => void;
  onSkip?: () => void;
  isSaving?: boolean;
}

export const Step3BuyerInterests = ({
  onContinue,
  onBack,
  onSkip,
  isSaving,
}: Step3BuyerInterestsProps) => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<BuyerProfileSchema>();

  const selectedInterests = watch("interests") || [];

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setValue(
        "interests",
        selectedInterests.filter((item) => item !== id),
        { shouldValidate: true, shouldDirty: true },
      );
    } else {
      setValue("interests", [...selectedInterests, id], {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <header className="mb-10">
        <h1 className="text-3xl md:text-display-lg text-on-surface mb-3">
          What are you most interested in?
        </h1>
        <p className="text-sm md:text-body-lg text-on-surface-variant max-w-2xl">
          Choose as many as you like. We’ll tailor your discovery feed based on
          these crafts.
        </p>
      </header>

      {/* Selection Grid */}
      <section className="flex flex-wrap gap-3 mb-12">
        {CRAFT_OPTIONS.map((craft) => {
          const isSelected = selectedInterests.includes(craft.id);
          return (
            <button
              key={craft.id}
              onClick={() => toggleInterest(craft.id)}
              className={cn(
                "px-5 py-2.5 rounded-full border transition-all duration-300 text-xs md:text-sm flex items-center gap-2",
                isSelected
                  ? "border-primary-container bg-primary-container text-on-primary-container shadow-sm"
                  : "border-outline-variant bg-surface hover:bg-primary-fixed hover:border-primary-fixed-dim text-on-surface",
              )}
            >
              {craft.name}
              {isSelected && <Check size={14} />}
            </button>
          );
        })}
      </section>

      {errors.interests && (
        <p className="mb-8 text-error text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-1">
          {errors.interests.message}
        </p>
      )}

      {/* Navigation Actions */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-outline-variant/30">
        <button
          onClick={onSkip} 
          className="text-xs md:text-sm font-bold text-on-surface-variant hover:text-primary transition-colors underline decoration-outline-variant/40 underline-offset-8 uppercase tracking-widest"
        >
          Skip for now
        </button>
        <div className="flex gap-4 w-full sm:w-auto">
          <Button
            onClick={onBack}
            variant="outline"
            size="lg"
            shape="rounded"
            className="flex-1 sm:flex-none"
          >
            Go Back
          </Button>
          <Button
            onClick={onContinue}
            size="lg"
            shape="rounded"
            disabled={isSaving}
            className="flex-1 sm:flex-none shadow-lg shadow-primary/10"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              "Continue to Final Step"
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
};

"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface CreateListingStepperProps {
  currentStep: number;
}

export function CreateListingStepper({
  currentStep,
}: CreateListingStepperProps) {
  const steps = [
    { id: 1, label: "Identity" },
    { id: 2, label: "AI Guide" },
    { id: 3, label: "Narrative" },
    { id: 4, label: "Pricing" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-16 px-4">
      <div className="relative flex justify-between">
        {/* Progress Line removed as requested */}

        {steps.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div
              key={step.id}
              className={cn(
                "flex flex-col items-center gap-3 transition-all duration-500",
                isActive ? "scale-110" : "scale-100"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold transition-all duration-500 border",
                  isCompleted
                    ? "bg-primary border-primary text-white"
                    : isActive
                      ? "bg-surface-container-lowest border-primary text-primary shadow-lg shadow-primary/10"
                      : "bg-surface-container-lowest border-outline-variant/30 text-on-surface-variant/40"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 md:w-5 md:h-5" />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>

              {/* Label - Hidden on very small screens, small on mobile */}
              <span
                className={cn(
                  "hidden sm:block font-label-caps text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500",
                  isActive
                    ? "text-primary opacity-100"
                    : isCompleted
                      ? "text-on-surface-variant opacity-60"
                      : "text-on-surface-variant/30 opacity-30"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

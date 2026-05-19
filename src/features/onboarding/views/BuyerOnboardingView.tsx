"use client";

import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useQueryState, parseAsInteger } from "nuqs";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { OnboardingHeader } from "../components/OnboardingHeader";
import {
  saveOnboardingStep,
} from "../actions/onboarding.action";
import { Step1BuyerWelcome } from "../components/buyer/Step1BuyerWelcome";
import { Step2BuyerProfile } from "../components/buyer/Step2BuyerProfile";
import { Step3BuyerInterests } from "../components/buyer/Step3BuyerInterests";
import { Step4BuyerCompletion } from "../components/buyer/Step4BuyerCompletion";
import { buyerProfileSchema, type BuyerProfileSchema } from "../schemas/buyer.schema";

const TOTAL_STEPS = 4;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const BuyerOnboardingView = ({ initialData }: { initialData?: Record<string, any> | null }) => {
  const [currentStep, setCurrentStep] = useQueryState(
    "step",
    parseAsInteger.withDefault(1).withOptions({ shallow: false }),
  );
  const [isSaving, setIsSaving] = useState(false);
  const stepContainerRef = useRef<HTMLDivElement>(null);

  const methods = useForm({
    resolver: zodResolver(buyerProfileSchema),
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      bio: initialData?.bio || "",
      country: initialData?.country || "",
      birthday: initialData?.birthday || "",
      interests: initialData?.interests || [],
      avatarUrl: initialData?.avatarUrl || "",
      avatarPublicId: initialData?.avatarPublicId || "",
    },
    mode: "onChange",
  });

  const { trigger } = methods;

  useEffect(() => {
    // Scroll to top on step change
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Animate in
    gsap.fromTo(
      stepContainerRef.current,
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.5, 
        ease: "power2.out", 
        delay: 0.1,
        clearProps: "all"
      },
    );
  }, [currentStep]);

  const handleNext = async () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      return;
    }

    let fieldsToValidate: (keyof BuyerProfileSchema)[] = [];
    if (currentStep === 2)
      fieldsToValidate = ["firstName", "lastName", "country", "birthday", "bio"];
    if (currentStep === 3) fieldsToValidate = ["interests"];

    const isValid = await trigger(fieldsToValidate);

    if (isValid && currentStep < TOTAL_STEPS) {
      setIsSaving(true);
      try {
        // Save data to DB
        const result = await saveOnboardingStep({ step: currentStep, data: methods.getValues() });
        if ("error" in result) {
          console.error("Failed to save onboarding step:", result.error);
          setIsSaving(false);
          return; // Stop if save fails
        }

        gsap.to(stepContainerRef.current, {
          opacity: 0,
          y: -20,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            // Reset defaultValues to current values so dirtyFields is cleared
            methods.reset(methods.getValues());
            setCurrentStep(currentStep + 1);
          },
        });
      } catch (error) {
        console.error("Onboarding save error:", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      gsap.to(stepContainerRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setCurrentStep(currentStep - 1);
        },
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen flex flex-col bg-surface">
        <OnboardingHeader currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        <main className="flex-1 flex flex-col items-center justify-start py-8 md:py-12 pb-20 md:pb-24 px-margin-page">
          <div ref={stepContainerRef} className="w-full max-w-7xl mx-auto">
            {currentStep === 1 && <Step1BuyerWelcome onContinue={handleNext} />}
            {currentStep === 2 && (
              <Step2BuyerProfile onContinue={handleNext} onBack={handleBack} isSaving={isSaving} />
            )}
            {currentStep === 3 && (
              <Step3BuyerInterests
                onContinue={handleNext}
                onBack={handleBack}
                isSaving={isSaving}
              />
            )}
            {currentStep === 4 && <Step4BuyerCompletion />}
          </div>
        </main>

        {currentStep < TOTAL_STEPS && (
          <footer className="w-full py-8 px-margin-page flex flex-col items-center text-center bg-surface-container-low mt-10">
            <div className="mb-4">
              <Image
                src="/logo-name.png"
                alt="Folkara"
                width={500}
                height={100}
                className="h-8 md:h-10 w-auto object-contain"
              />
            </div>
            <p className="font-sans text-xs md:text-sm text-on-surface-variant max-w-md">
              © 2024 Folkara. Intentional objects for a slower life. All rights
              reserved.
            </p>
            <div className="flex gap-8 mt-6">
              <a
                className="font-sans text-[10px] font-bold text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest"
                href="#"
              >
                Privacy Policy
              </a>
              <a
                className="font-sans text-[10px] font-bold text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest"
                href="#"
              >
                Terms of Service
              </a>
            </div>
          </footer>
        )}
      </div>
    </FormProvider>
  );
};

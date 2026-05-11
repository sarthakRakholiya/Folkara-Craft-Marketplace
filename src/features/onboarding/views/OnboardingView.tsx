"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { gsap } from 'gsap';
import { useQueryState, parseAsInteger } from 'nuqs';
import { OnboardingHeader } from '../components/OnboardingHeader';
import { Step1CraftSelection } from '../components/seller/Step1CraftSelection';
import { Step2ShopName } from '../components/seller/Step2ShopName';
import { Step3Location } from '../components/seller/Step3Location';
import { Step4ArtisanProfile } from '../components/seller/Step4ArtisanProfile';
import { Step5Success } from '../components/seller/Step5Success';
import { craftSelectionSchema, shopNameSchema, locationSchema, artisanProfileSchema } from '../types/onboarding.types';
import { Button } from '@/components/ui/Button';
import { z } from 'zod';

const TOTAL_STEPS = 5;

export const OnboardingView = () => {
  const [currentStep, setCurrentStep] = useQueryState(
    'step',
    parseAsInteger.withDefault(1).withOptions({ shallow: false })
  );
  const stepContainerRef = useRef<HTMLDivElement>(null);

  const combinedSchema = z.object({
    ...craftSelectionSchema.shape,
    ...shopNameSchema.shape,
    ...locationSchema.shape,
    ...artisanProfileSchema.shape,
  });

  const methods = useForm({
    resolver: zodResolver(combinedSchema),
    defaultValues: {
      craftIds: [],
      customCraft: '',
      shopName: '',
      logoUrl: '',
      country: '',
      city: '',
      showLocation: true,
      firstName: '',
      lastName: '',
      makerPortrait: '',
      makerQuote: '',
      story: '',
    },
    mode: 'onChange',
  });

  const { trigger, handleSubmit, formState: { isSubmitting } } = methods;

  const handleNext = async () => {
    // Validate only current step fields
    let fieldsToValidate: any[] = [];
    if (currentStep === 1) fieldsToValidate = ['craftIds'];
    if (currentStep === 2) fieldsToValidate = ['shopName'];
    if (currentStep === 3) fieldsToValidate = ['country'];
    if (currentStep === 4) fieldsToValidate = ['firstName', 'lastName', 'story'];
    if (currentStep === 5) return; // Already on success page

    const isValid = await trigger(fieldsToValidate as any);
    
    if (isValid && currentStep < TOTAL_STEPS) {
      // Animate out
      gsap.to(stepContainerRef.current, {
        opacity: 0,
        x: -20,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          setCurrentStep(currentStep + 1);
        }
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      gsap.to(stepContainerRef.current, {
        opacity: 0,
        x: 20,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          setCurrentStep(currentStep - 1);
        }
      });
    }
  };

  useEffect(() => {
    // Scroll to top on step change
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Animate in
    const direction = currentStep === 1 ? 0 : 20; // Slight tweak for initial load
    gsap.fromTo(stepContainerRef.current, 
      { opacity: 0, x: direction },
      { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', delay: 0.1 }
    );
  }, [currentStep]);

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-surface flex flex-col">
        <OnboardingHeader currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        
        <main className="flex-1 flex flex-col items-center justify-start py-6 md:py-10 px-margin-page">
          <div ref={stepContainerRef} className="w-full">
            {currentStep === 1 && <Step1CraftSelection />}
            {currentStep === 2 && <Step2ShopName />}
            {currentStep === 3 && <Step3Location />}
            {currentStep === 4 && <Step4ArtisanProfile />}
            {currentStep === 5 && <Step5Success />}
          </div>

          {currentStep < 5 && (
            <div className="mt-10 w-full flex flex-col md:flex-row items-center justify-center gap-4 px-margin-page">
              {currentStep > 1 && (
                <Button 
                  onClick={handleBack}
                  variant="ghost"
                  size="lg"
                  shape="full"
                  className="px-16 w-full md:w-auto text-outline hover:text-primary order-2 md:order-1"
                >
                  Back
                </Button>
              )}
              <Button 
                onClick={handleNext}
                size="lg"
                shape="full"
                className="px-16 w-full md:w-auto shadow-xl shadow-primary/20 order-1 md:order-2"
              >
                {currentStep === 4 ? 'Complete' : 'Continue'}
              </Button>
            </div>
          )}
        </main>

        <footer className="w-full py-8 px-margin-page flex flex-col items-center text-center bg-surface-container-low mt-10">
          <div className="mb-4">
            <img src="/logo.png" alt="Folkara" className="h-8 md:h-10 object-contain" />
          </div>
          <p className="font-sans text-xs md:text-sm text-on-surface-variant max-w-md">
            © 2024 Folkara. Intentional objects for a slower life. All rights reserved.
          </p>
          <div className="flex gap-8 mt-6">
            <a className="font-sans text-[10px] font-bold text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest" href="#">Privacy Policy</a>
            <a className="font-sans text-[10px] font-bold text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest" href="#">Terms of Service</a>
          </div>
        </footer>
      </div>
    </FormProvider>
  );
};

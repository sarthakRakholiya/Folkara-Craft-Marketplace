"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useCallback, useRef, useEffect, useLayoutEffect } from "react";
import { useCreateListingForm } from "@/features/seller/listings/hooks/useCreateListingForm";
import { Step1GeneralInfo } from "@/features/seller/listings/components/createListing/Step1GeneralInfo";
import { AIAnalysis } from "@/features/seller/listings/components/createListing/AIAnalysis";
import { ReviewAIData } from "@/features/seller/listings/components/createListing/ReviewAIData";
import { Step4Pricing } from "@/features/seller/listings/components/createListing/Step4Pricing";
import { getProductByIdAction, publishProductAction } from "@/features/seller/listings/actions/product.actions";
import { StepLoader } from "../components/createListing/StepLoader";
import { toast } from "sonner";
import gsap from "gsap";

export function CreateListingView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const stepContainerRef = useRef<HTMLDivElement>(null);

  // Listing State
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [listingId, setListingId] = useState<string | null>(searchParams.get("id"));
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  
  const form = useCreateListingForm();
  const lastStepRef = useRef<number | null>(null);

  const animateStepTransition = useCallback((newStep: number) => {
    if (!stepContainerRef.current) {
      setActiveStep(newStep);
      return;
    }

    // Kill any existing animations to prevent conflicts
    gsap.killTweensOf(stepContainerRef.current);

    const tl = gsap.timeline({
      onComplete: () => {
        // Switch component
        setActiveStep(newStep);
        
        // Wait for render, then animate in
        requestAnimationFrame(() => {
          if (stepContainerRef.current) {
            gsap.fromTo(
              stepContainerRef.current,
              { opacity: 0, y: 15 },
              { 
                opacity: 1, 
                y: 0, 
                duration: 0.5, 
                ease: "expo.out",
                clearProps: "all" // Important to prevent layout issues later
              }
            );
          }
        });
      },
    });

    // Fade out current content
    tl.to(stepContainerRef.current, {
      opacity: 0,
      y: -15,
      duration: 0.25,
      ease: "power2.in",
    });
  }, []);

  const updateStep = useCallback(
    (newStep: number, id?: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", newStep.toString());
      if (id) params.set("id", id);
      
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const handleNext = useCallback((id?: any) => {
    const productId = typeof id === 'string' ? id : undefined;
    if (activeStep !== null && activeStep < 4) {
      updateStep(activeStep + 1, productId);
    }
  }, [activeStep, updateStep]);

  const handleBack = useCallback(() => {
    if (activeStep === 4) updateStep(3);
    else if (activeStep === 3) updateStep(1);
  }, [activeStep, updateStep]);

  const handleSubmit = async () => {
    if (!listingId) return;
    
    const values = form.getValues();
    setIsPublishing(true);
    const result = await publishProductAction({
      productId: listingId,
      data: {
        title: values.title || "",
        description: values.description || "",
        tags: (values.tags as string[]) || [],
        price: Number(values.price),
        quantity: Number(values.quantity),
        category: values.category || "",
      }
    });

    if ("success" in result) {
      toast.success("Listing Live! ✨", {
        description: "Your masterpiece is now visible to collectors worldwide. Happy selling!",
      });
      router.push("/seller/listings");
    } else {
      toast.error("Failed to publish", { description: result.error });
      setIsPublishing(false);
    }
  };

  // Initialize step from URL
  useLayoutEffect(() => {
    const step = Number(searchParams.get("step")) || 1;
    setActiveStep(step);
    lastStepRef.current = step;
  }, []);

  // Hydrate form if ID exists (Persistence on refresh)
  useEffect(() => {
    async function hydrateListing() {
      const id = searchParams.get("id");
      const currentStep = Number(searchParams.get("step")) || 1;

      // Handle case where we have no ID
      if (!id) {
        // If we are past the AI creation step (step 2) but have no ID, go back to step 1
        if (currentStep > 2) {
          toast.error("Invalid Session", { description: "Redirecting to step 1..." });
          updateStep(1);
        }
        
        // If we have a local listingId but the URL says no ID, clear everything
        if (listingId !== null) {
          setListingId(null);
          form.reset({
            title: "",
            description: "",
            category: "",
            price: 0,
            quantity: 1,
            tags: [],
            images: [],
          });
        }
        return;
      }

      // Optimization: If we already have this ID loaded and form has content, skip fetch
      if (id === listingId && form.getValues("title") !== "") {
        return;
      }

      setIsLoading(true);
      const product = await getProductByIdAction(id);
      
      if (product) {
        form.reset({
          title: product.title || "",
          description: product.description || "",
          category: product.category || "",
          price: Number(product.price) || 0,
          quantity: Number(product.quantity) || 1,
          tags: (product.tags as string[]) || [],
          images: (product.images as any[]) || [],
        });
        setListingId(id);
      } else {
        toast.error("Listing Not Found", { description: "Starting fresh..." });
        setListingId(null);
        form.reset();
        updateStep(1);
      }
      setIsLoading(false);
    }

    hydrateListing();
  }, [searchParams, form, updateStep, listingId]);

  // Handle URL navigation (back/forward) & the ONLY trigger for transitions
  useEffect(() => {
    const stepFromUrl = Number(searchParams.get("step")) || 1;
    
    if (stepFromUrl !== activeStep && activeStep !== null) {
      // Run the animation
      animateStepTransition(stepFromUrl);
    }
  }, [searchParams, activeStep, animateStepTransition]);

  // Prevent rendering until step is initialized
  if (activeStep === null) return null;

  return (
    <main className="pt-8 md:pt-24 pb-20 px-4 md:px-margin-page max-w-container-max mx-auto overflow-x-hidden">
      {isLoading ? (
        <StepLoader />
      ) : (
        <div ref={stepContainerRef}>
          {activeStep === 1 && (
            <Step1GeneralInfo 
              form={form} 
              onNext={handleNext} 
              productId={listingId}
            />
          )}

          {activeStep === 2 && (
            <AIAnalysis 
              form={form} 
              onComplete={(id) => handleNext(id)} 
              onBack={() => updateStep(1)}
            />
          )}

          {activeStep === 3 && (
            <ReviewAIData form={form} onNext={handleNext} onBack={handleBack} productId={listingId} />
          )}

          {activeStep === 4 && (
            <Step4Pricing
              form={form}
              onSubmit={handleSubmit}
              onBack={handleBack}
              loading={isPublishing}
            />
          )}
        </div>
      )}
    </main>
  );
}


"use client";

import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useState, useCallback, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCreateListingForm } from "@/features/seller/listings/hooks/useCreateListingForm";
import { ReviewAIData } from "@/features/seller/listings/components/createListing/ReviewAIData";
import { Step4Pricing } from "@/features/seller/listings/components/createListing/Step4Pricing";
import {
  getProductByIdAction,
  publishProductAction,
} from "@/features/seller/listings/actions/product.actions";
import { queryKeys } from "@/lib/queryKeys";
import { StepLoader } from "../components/createListing/StepLoader";
import { toast } from "sonner";
import gsap from "gsap";

export function EditListingView() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;

  const [activeStep, setActiveStep] = useState(
    Number(searchParams.get("step")) || 1,
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [initialData, setInitialData] = useState<Record<string, unknown> | null>(null);
  const stepContainerRef = useRef<HTMLDivElement>(null);
  const form = useCreateListingForm();

  const { 
    data: product, 
    isLoading: isQueryLoading,
    error 
  } = useQuery({
    queryKey: queryKeys.product(id),
    queryFn: async () => {
      const product = await getProductByIdAction(id);
      if (!product) throw new Error("Listing not found");
      return product;
    },
    enabled: !!id,
    retry: false,
  });

  useEffect(() => {
    if (product) {
      const normalizedData = {
        title: product.title || "",
        description: product.description || "",
        category: product.category || "",
        price: Number(product.price) || 0,
        quantity: product.quantity || 1,
        tags: (product.tags as string[]) || [],
        images: (product.images as { url: string }[]) || [],
      };
      form.reset(normalizedData);
      setInitialData(normalizedData);
    }
  }, [product, form]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Listing not found");
      router.push("/seller/listings");
    }
  }, [error, router]);

  const animateStepTransition = useCallback(
    (newStep: number) => {
      if (!stepContainerRef.current) {
        setActiveStep(newStep);
        return;
      }

      gsap.to(stepContainerRef.current, {
        opacity: 0,
        y: -15,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          setActiveStep(newStep);
          router.push(`?step=${newStep}`, { scroll: false });
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
                  clearProps: "all",
                },
              );
            }
          });
        },
      });
    },
    [router],
  );

  const handleUpdate = async () => {
    const values = form.getValues();

    const currentData = {
      title: values.title || "",
      description: values.description || "",
      category: values.category || "",
      price: Number(values.price),
      quantity: Number(values.quantity),
      tags: values.tags || [],
      images: values.images || [],
    };

    if (JSON.stringify(currentData) === JSON.stringify(initialData)) {
      toast.info("No changes made", {
        description: "Redirecting to gallery...",
      });
      router.push("/seller/listings");
      return;
    }

    setIsUpdating(true);
    const result = await publishProductAction({
      productId: id,
      data: currentData,
    });

    if ("success" in result) {
      toast.success("Listing Updated ✨", {
        description: "Your refinements are live.",
      });
      router.push("/seller/listings");
    } else {
      toast.error("Failed to update", { description: result.error });
    }
    setIsUpdating(false);
  };

  if (isQueryLoading) {
    return (
      <main className="pt-8 md:pt-24 pb-20 px-4 md:px-margin-page max-w-container-max mx-auto">
        <StepLoader />
      </main>
    );
  }

  return (
    <main className="pt-8 md:pt-24 pb-20 px-4 md:px-margin-page max-w-container-max mx-auto overflow-x-hidden">
      <div ref={stepContainerRef}>
        {activeStep === 1 && (
          <ReviewAIData
            form={form}
            onNext={() => animateStepTransition(2)}
            productId={id}
            isEdit
            hideImages
          />
        )}

        {activeStep === 2 && (
          <Step4Pricing
            form={form}
            onSubmit={handleUpdate}
            onBack={() => animateStepTransition(1)}
            isEdit
            hideImages
            loading={isUpdating}
          />
        )}
      </div>
    </main>
  );
}

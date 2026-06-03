"use client";

import { CreateListingSchema } from "@/features/seller/listings/hooks/useCreateListingForm";
import { UseFormReturn } from "react-hook-form";
import { FormInput } from "@/components/form/FormInput";
import { FormTextarea } from "@/components/form/FormTextarea";
import { Button } from "@/components/ui/Button";
import { useEffect, useMemo, useState, useRef, useLayoutEffect } from "react";
import {
  Sparkles,
  ArrowRight,
  X,
  RefreshCw,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { refineProductNarrativeAction } from "@/features/seller/listings/actions/product.actions";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import gsap from "gsap";

interface ReviewAIDataProps {
  form: UseFormReturn<CreateListingSchema>;
  onNext: () => void;
  onBack?: () => void;
  productId: string | null;
  isEdit?: boolean;
  hideImages?: boolean;
}

export function ReviewAIData({ 
  form, 
  onNext, 
  onBack, 
  productId,
  isEdit = false,
  hideImages = false
}: ReviewAIDataProps) {
  const [newTag, setNewTag] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".animate-in-item",
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.1,
          ease: "expo.out",
          delay: 0.2,
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Memoize previews to handle both initial load (URLs) and new uploads (Files)
  const previews = useMemo(() => {
    const images = form.getValues("images");
    if (!images || images.length === 0) return [];
    return images.map((file: any) => 
      file instanceof File ? URL.createObjectURL(file) : file.url
    );
  }, [form]);

  const addTag = () => {
    if (!newTag.trim()) return;
    const currentTags = form.getValues("tags") || [];
    if (!currentTags.includes(newTag.trim())) {
      form.setValue("tags", [...currentTags, newTag.trim()]);
    }
    setNewTag("");
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove),
    );
  };

  const handleRefine = async () => {
    if (!feedback.trim() || !productId) return;
    setIsRefining(true);
    
    const result = await refineProductNarrativeAction({ productId, feedback });
    
    if ("success" in result && result.success && "data" in result) {
      form.setValue("title", result.data.title);
      form.setValue("description", result.data.description);
      form.setValue("category", result.data.category);
      form.setValue("tags", result.data.tags);
      setFeedback("");
      toast.success("Details Refined! ✨");
    } else if ("error" in result) {
      toast.error("Refinement Failed", { description: result.error });
    }
    
    setIsRefining(false);
  };

  const handleNextStep = () => {
    setIsNavigating(true);
    onNext();
  };

  return (
    <div ref={containerRef} className="max-w-[1400px] mx-auto">
      {/* Step Indicator & Message */}
      <div className="animate-in-item space-y-4 mb-12 opacity-0">
        <div className="flex items-center gap-3">
          <span className="font-label-caps text-[10px] text-on-secondary-container bg-secondary-container px-3 py-1 rounded-full uppercase font-bold tracking-widest">
            {isEdit ? "Edit Step 1 of 3" : "Step 3 of 4"}
          </span>
          <span className="h-px w-12 bg-outline-variant/30"></span>
          <span className="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold tracking-widest opacity-40">
            Reviewing Details
          </span>
        </div>
        <h1 className="font-display-lg text-2xl md:text-5xl text-primary tracking-tight">
          Your product is ready.
        </h1>
        <p className="font-body-lg text-sm md:text-lg text-on-surface-variant max-w-2xl italic opacity-80 leading-relaxed">
          &quot;Our AI guide has analyzed your work to prepare a professional listing that helps your product find its home.&quot;
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8 items-start mb-12">
        {/* Main Content Area - Storytelling */}
        <div className="animate-in-item xl:col-span-8 space-y-6 opacity-0">
          <div className="bg-surface-container-lowest border border-outline-variant/5 rounded-2xl md:rounded-[2rem] p-5 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-6 md:space-y-8">
            {/* Title Section */}
            <div className="space-y-2">
              <label className="font-label-caps text-[9px] text-secondary/60 font-bold tracking-[0.3em] uppercase flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Product Title
              </label>
              <FormTextarea
                control={form.control}
                name="title"
                autosize
                textareaClassName="font-headline-md text-xl md:text-3xl "
              />
            </div>

            {/* Description Section */}
            <div className="space-y-4">
              <label className="font-label-caps text-[9px] text-secondary/60 font-bold tracking-[0.3em] uppercase flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Product Details
              </label>
              <FormTextarea
                control={form.control}
                name="description"
                autosize
                textareaClassName="font-body-lg text-xl"
              />
            </div>

            {/* Images - Integrated as a curated strip */}
            {!hideImages && (
              <div className="pt-8 border-t border-outline-variant/5">
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {previews.map((p, i) => (
                    <div
                      key={i}
                      className="shrink-0 w-48 aspect-square rounded-2xl overflow-hidden border border-outline-variant/10 shadow-sm hover:scale-[1.02] transition-transform duration-500"
                    >
                      <Image
                        src={p}
                        alt="Craft"
                        width={192}
                        height={192}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Area - Metadata & Refinement */}
        <div className="animate-in-item xl:col-span-4 space-y-6 flex flex-col opacity-0">
          {/* Metadata Card */}
          <div className="bg-surface-container-low/50 backdrop-blur-md rounded-[2.5rem] border border-outline-variant/10 p-8 space-y-8 flex-shrink-0 self-start w-full">
            <div className="space-y-6">
              <div className="space-y-1">
                <label className="font-label-caps text-[9px] text-secondary/60 font-bold tracking-[0.2em] uppercase">
                  Category
                </label>
                <FormTextarea
                  control={form.control}
                  name="category"
                  autosize
                  textareaClassName="font-body-lg text-lg text-primary font-semibold resize-none overflow-hidden min-h-0"
                />
              </div>

              <div className="space-y-3">
                <label className="font-label-caps text-[9px] text-secondary/60 font-bold tracking-[0.2em] uppercase">
                  Artisan Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {(form.watch("tags") || []).map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-lowest text-[10px] font-bold text-primary border border-outline-variant/20 rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-error transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    placeholder="Add tag..."
                    className="bg-transparent border-b border-outline-variant/30 focus:border-primary outline-none text-[11px] py-1 flex-1 italic placeholder:text-outline/30"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Refinement Card */}
          <div className="bg-secondary/5 rounded-[2.5rem] border border-secondary/10 p-8 space-y-6 flex-shrink-0 self-start w-full">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-secondary" />
              </div>
              <h3 className="font-headline-sm text-base text-secondary italic">
                Refine Product Info
              </h3>
            </div>
            <div className="space-y-4">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell me what to change..."
                className="w-full p-0 text-sm italic outline-none min-h-[80px] h-full  placeholder:text-secondary/30 border border-secondary/10 rounded-2xl p-4"
              />
              <Button
                onClick={handleRefine}
                disabled={!feedback.trim() || isRefining}
                variant="secondary"
                size="sm"
                className="w-full h-12 text-[10px] font-bold tracking-widest rounded-lg"
                startIcon={
                  isRefining ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )
                }
              >
                {isRefining ? "REFINING..." : "REFINE DETAILS"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="animate-in-item pt-12 border-t border-outline-variant/10 flex flex-col sm:flex-row items-center justify-end gap-8 pb-20 opacity-0">
        <div className="flex flex-col sm:flex-row items-center gap-8 w-full sm:w-auto">
          <Button
            onClick={handleNextStep}
            variant="primary"
            shape="rounded"
            size="lg"
            className="w-full sm:w-auto px-16 py-6 shadow-2xl"
            loading={isNavigating}
            endIcon={<ArrowRight className="w-4 h-4" />}
          >
            {isEdit ? "CONTINUE TO DETAILS" : "CONTINUE TO PRICING"}
          </Button>
        </div>
      </div>
    </div>
  );
}

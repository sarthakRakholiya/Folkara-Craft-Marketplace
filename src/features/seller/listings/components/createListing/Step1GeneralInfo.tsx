import { CreateListingSchema } from "@/features/seller/listings/hooks/useCreateListingForm";
import { UseFormReturn } from "react-hook-form";
import { useState, useRef, ChangeEvent, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { FormInput } from "@/components/form/FormInput";
import { FormTextarea } from "@/components/form/FormTextarea";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import {
  Sparkles,
  Camera,
  Plus,
  X,
  FileText,
  MousePointerClick,
} from "lucide-react";
import gsap from "gsap";

import { createDraftProductAction } from "@/features/seller/listings/actions/product.actions";

interface Step1GeneralInfoProps {
  form: UseFormReturn<CreateListingSchema>;
  onNext: (id: string) => void;
  productId?: string | null;
}

export function Step1GeneralInfo({ form, onNext, productId }: Step1GeneralInfoProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  // Initialize previews from form (for hydration/back navigation)
  useEffect(() => {
    const images = form.getValues("images");
    if (images && images.length > 0) {
      const existingPreviews = images.map((img: any) => 
        img instanceof File ? URL.createObjectURL(img) : img.url
      );
      setPreviews(existingPreviews);
    }
  }, [form]);

  // Helper to convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + previews.length > 3) {
      toast.error("Limit Reached", {
        description: "You can only upload a maximum of 3 artisan photos.",
      });
      return;
    }

    const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB
    for (const file of files) {
      if (file.size > MAX_SIZE_BYTES) {
        toast.error("File Too Large", {
          description: `"${file.name}" is too large. Maximum size is 2 MB.`,
        });
        return;
      }
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);

    const currentImages = form.getValues("images");
    form.setValue("images", [...currentImages, ...files]);
  };

  const handleContinue = async () => {
    const images = form.getValues("images");
    if (images.length === 0) {
      toast.error("Images Required", { description: "Please upload at least one artisan photo." });
      return;
    }

    setIsAnalyzing(true);
    try {
      // We've moved draft creation to Step 2 (AI Analysis) 
      // for a smoother transition experience.
      onNext(productId || "");
    } catch (error) {
      console.error("Creation error:", error);
      toast.error("Something went wrong. Please try again.");
      setIsAnalyzing(false);
    }
  };

  const removeImage = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    const currentImages = form.getValues("images");
    form.setValue(
      "images",
      currentImages.filter((_, i) => i !== index),
    );
  };

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Step Indicator & Message */}
      <div className="animate-in-item space-y-4 opacity-0">
        <div className="flex items-center gap-3">
          <span className="font-label-caps text-[10px] text-on-secondary-container bg-secondary-container px-3 py-1 rounded-full uppercase font-bold tracking-widest">
            Step 1 of 4
          </span>
          <span className="h-px w-12 bg-outline-variant/30"></span>
          <span className="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold tracking-widest opacity-40">
            General Info
          </span>
        </div>
        <h1 className="font-display-lg text-2xl md:text-5xl text-primary tracking-tight">
          Create a New Listing
        </h1>
        <p className="font-body-lg text-sm md:text-lg text-on-surface-variant max-w-2xl italic opacity-80 leading-relaxed">
          &quot;Every piece has a journey. Let&apos;s start your listing here.&quot;
        </p>
      </div>

      {/* Full-Width AI Note */}
      <div className="animate-in-item bg-surface-container-lowest/40 backdrop-blur-sm rounded-2xl p-6 border border-outline-variant/10 shadow-sm flex items-start gap-5 opacity-0">
        <div className="bg-primary/5 p-2.5 rounded-full shrink-0">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
        </div>
        <div className="space-y-2">
          <h4 className="text-[11px] font-label-caps text-primary font-bold tracking-[0.2em] uppercase">
            Folkara AI Optimization
          </h4>
          <p className="text-[13px] text-on-surface-variant leading-relaxed italic opacity-90">
            &quot;Our advanced AI analyzes your craftsmanship photos and artisan
            notes to draft a professional product listing. We&quot;ll automatically
            generate an SEO-optimized title, a detailed description,
            and smart tags to help your work find its perfect home.&quot;
          </p>
          <div className="flex items-center gap-4 pt-1">
            {["SEO Mastery", "Visual Analysis", "Vivid Storytelling"].map(
              (tag) => (
                <span
                  key={tag}
                  className="text-[9px] font-label-caps text-primary/40 flex items-center gap-1"
                >
                  <span className="w-1 h-1 bg-primary/30 rounded-full" />
                  {tag}
                </span>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Two-Column Layout Below Note */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Upload Zone */}
        <div className="animate-in-item lg:col-span-5 opacity-0">
          {previews.length === 0 ? (
            /* Big Upload Zone (Empty State) */
            <div
              className="bg-surface-container-low/50 rounded-2xl p-6 border-2 border-dashed border-outline-variant/30 flex flex-col items-center justify-center min-h-[260px] group hover:border-primary/40 transition-all duration-500 cursor-pointer shadow-sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
                accept="image/*"
              />
              <div className="text-center space-y-4">
                <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500">
                  <Camera className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <h2 className="font-headline-sm text-lg text-primary">
                    Craft Photos
                  </h2>
                  <p className="text-[11px] text-on-surface-variant max-w-[180px] mx-auto leading-relaxed opacity-60">
                    Showcase the soul of your Slow-Made piece.
                  </p>
                  <p className="text-[9px] text-on-surface-variant/40 max-w-[180px] mx-auto leading-relaxed uppercase tracking-wider font-semibold">
                    JPG, PNG or WebP · max 2 MB
                  </p>
                </div>
                <Button
                  variant="outline"
                  shape="rounded"
                  size="sm"
                  className="text-[10px]"
                  startIcon={<MousePointerClick className="w-3 h-3" />}
                >
                  SELECT FILES
                </Button>
              </div>
            </div>
          ) : (
            /* Compact Card Grid (Populated State) */
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-label-caps text-[10px] text-primary/60 font-bold tracking-widest uppercase">
                  Gallery ({previews.length}/3)
                </h3>
                {previews.length < 3 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[10px] font-label-caps text-primary/60 underline hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> ADD
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-[400px]">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                  accept="image/*"
                />

                {previews.map((preview, index) => (
                  <div
                    key={index}
                    className={cn(
                      "relative bg-surface-container-low rounded-xl overflow-hidden group shadow-sm border border-outline-variant/10",
                      index === 0
                        ? "col-span-2 aspect-[2/1]"
                        : "col-span-1 aspect-square",
                    )}
                  >
                    <Image
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-7 h-7 bg-error text-on-error rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-error-container z-10 shadow-lg flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {previews.length < 3 && (
                  <div
                    className={cn(
                      "bg-surface-container-lowest/50 rounded-xl border-2 border-dashed border-outline-variant/20 flex flex-col items-center justify-center text-outline transition-all hover:border-primary/40 hover:bg-primary/[0.01] cursor-pointer group shadow-sm",
                      previews.length === 0
                        ? "col-span-2 aspect-[2/1]"
                        : "col-span-1 aspect-square",
                    )}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-8 h-8 bg-surface-container-high rounded-full flex items-center justify-center mb-1 group-hover:bg-primary/10 transition-colors">
                      <Plus className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-[9px] font-label-caps font-bold tracking-widest text-primary/40 uppercase">
                      Add
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Content Zone */}
        <div className="animate-in-item lg:col-span-7 space-y-6 opacity-0">
          <div className="bg-surface-container-lowest/60 p-8 rounded-2xl shadow-sm border border-outline-variant/10 space-y-10">
            <div className="space-y-8">
              {/* Artisan Notes */}
              <div className="space-y-4 pt-4 border-t border-outline-variant/5">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="font-headline-sm text-sm text-primary uppercase tracking-widest opacity-60">
                    Artisan Notes{" "}
                    <span className="text-[10px] text-on-surface-variant font-normal opacity-40 uppercase tracking-widest ml-2">
                      (Optional)
                    </span>
                  </h3>
                </div>

                <FormTextarea
                  control={form.control}
                  name="description"
                  placeholder="Tell the story of your piece... What inspired it? What materials were used?"
                  autosize
                  rows={4}
                  textareaClassName="bg-transparent italic text-base leading-relaxed placeholder:text-on-surface-variant/20 border-none focus:ring-0 p-0"
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handleContinue}
            variant="primary"
            shape="rounded"
            size="lg"
            className="w-full py-5 shadow-sm"
            disabled={previews.length === 0 || isAnalyzing}
            loading={isAnalyzing}
            endIcon={<Sparkles className="w-4 h-4" />}
          >
            {isAnalyzing ? "CREATING DRAFT..." : "CONTINUE TO PRODUCT DETAILS"}
          </Button>
        </div>
      </div>
    </div>
  );
}

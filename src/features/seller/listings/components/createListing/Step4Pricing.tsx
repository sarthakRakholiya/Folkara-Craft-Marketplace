"use client";

import { CreateListingSchema } from "@/features/seller/listings/hooks/useCreateListingForm";
import { UseFormReturn } from "react-hook-form";
import { FormInput } from "@/components/form/FormInput";
import { Button } from "@/components/ui/Button";
import { Sparkles, ArrowRight, IndianRupee, Package, Tag } from "lucide-react";
import { useMemo, useRef, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";

interface Step4PricingProps {
  form: UseFormReturn<CreateListingSchema>;
  onSubmit: () => void;
  onBack: () => void;
  isEdit?: boolean;
  hideImages?: boolean;
  loading?: boolean;
}

export function Step4Pricing({ 
  form, 
  onSubmit, 
  onBack,
  isEdit = false,
  hideImages = false,
  loading = false
}: Step4PricingProps) {
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

  // Memoize previews for visual confirmation
  const previews = useMemo(() => {
    const images = form.getValues("images");
    if (!images || images.length === 0) return [];
    return images.map((file: File | { url: string }) => 
      file instanceof File ? URL.createObjectURL(file) : file.url
    );
  }, [form]);

  const title = form.watch("title");
  const description = form.watch("description");
  const category = form.watch("category");
  const tags = form.watch("tags") || [];

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Step Indicator & Message */}
      <div className="animate-in-item space-y-4 opacity-0">
        <div className="flex items-center gap-3">
          <span className="font-label-caps text-[10px] text-on-secondary-container bg-secondary-container px-3 py-1 rounded-full uppercase font-bold tracking-widest">
            {isEdit ? "Edit Step 2 of 3" : "Step 4 of 4"}
          </span>
          <span className="h-px w-12 bg-outline-variant/30"></span>
          <span className="font-label-caps text-[10px] text-on-surface-variant uppercase font-bold tracking-widest opacity-40">
            {isEdit ? "Update Details" : "Finalize Listing"}
          </span>
        </div>
        <h1 className="font-display-lg text-2xl md:text-5xl text-primary tracking-tight">Set your value.</h1>
        <p className="font-body-lg text-sm md:text-lg text-on-surface-variant max-w-2xl italic opacity-80 leading-relaxed">
          &quot;Your details are set. Now, define the value for your craftsmanship.&quot;
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-start">
        {/* Left Side: Summary Card (Read-only Details) */}
        <div className="animate-in-item lg:col-span-6 space-y-6 md:space-y-8 opacity-0">
          <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-[2.5rem] p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] space-y-8 md:space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-primary/40">
                <Tag className="w-4 h-4" />
                <span className="font-label-caps text-[10px] font-bold tracking-widest uppercase">{category || "Uncategorized"}</span>
              </div>
              <h2 className="font-display-md text-3xl text-primary">{title || "Untitled Masterpiece"}</h2>
              <p className="font-body-md text-on-surface-variant/70 leading-relaxed line-clamp-4 italic">
                {description || "No description provided yet..."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag: string) => (
                <span key={tag} className="px-4 py-1.5 bg-surface-container-high rounded-full text-[10px] font-label-caps font-bold text-secondary tracking-widest uppercase border border-outline-variant/5">
                  {tag}
                </span>
              ))}
            </div>

            {!hideImages && (
              <div className="pt-8 border-t border-outline-variant/10 space-y-4">
                <span className="text-[10px] font-label-caps font-bold uppercase tracking-[0.2em] opacity-40 block">
                  Visual Context
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {previews.map((p, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-xl overflow-hidden border border-outline-variant/10 shadow-sm hover:scale-[1.02] transition-transform duration-500"
                    >
                      <Image src={p} alt="Context" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Pricing & Inventory Form */}
        <div className="animate-in-item lg:col-span-6 space-y-6 md:space-y-8 opacity-0">
          <div className="bg-surface-container-lowest/40 backdrop-blur-md p-6 md:p-10 rounded-3xl border border-outline-variant/10 shadow-xl space-y-8 md:space-y-10">
            <div className="space-y-8 md:space-y-10">
              {/* Price Field */}
              <div className="bg-surface-container-low/40 rounded-2xl p-6 md:p-8 border border-outline-variant/10 shadow-inner group focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <label className="block font-label-caps text-[10px] text-secondary mb-4 md:mb-6 font-bold tracking-[0.2em] uppercase">LISTING PRICE (INR)</label>
                <div className="flex items-baseline gap-2">
                  <IndianRupee className="w-8 h-8 text-primary/40" />
                  <FormInput
                    control={form.control}
                    name="price"
                    type="number"
                    placeholder="0.00"
                    variant="default"
                    inputClassName="bg-transparent border-none focus:ring-0 p-0 font-headline-md text-3xl md:text-6xl text-primary"
                  />
                </div>
                <p className="mt-4 md:mt-6 text-[11px] text-on-surface-variant italic opacity-60 flex items-center gap-2">
                   <Sparkles className="w-3 h-3" />
                   Our AI suggests ₹84.00
                </p>
              </div>

              {/* Quantity Field */}
              <div className="bg-surface-container-low/40 rounded-2xl p-6 md:p-8 border border-outline-variant/10 shadow-inner group focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <label className="block font-label-caps text-[10px] text-secondary mb-4 md:mb-6 font-bold tracking-[0.2em] uppercase">AVAILABLE STOCK</label>
                <div className="flex items-baseline gap-4">
                  <Package className="w-8 h-8 text-primary/40" />
                  <FormInput
                    control={form.control}
                    name="quantity"
                    type="number"
                    placeholder="1"
                    variant="default"
                    inputClassName="bg-transparent border-none focus:ring-0 p-0 font-headline-md text-3xl md:text-6xl text-primary"
                  />
                </div>
              </div>
            </div>

            <div className="pt-10 flex flex-col sm:flex-row items-center gap-6">
              <button 
                type="button"
                onClick={onBack}
                className="flex items-center gap-2 text-secondary/60 hover:text-primary transition-colors font-label-caps text-[10px] font-bold tracking-widest uppercase"
              >
                BACK TO DETAILS
              </button>
              <Button 
                onClick={onSubmit}
                variant="primary"
                shape="rounded"
                size="lg"
                className="w-full sm:w-auto px-16 py-6 shadow-2xl"
                endIcon={<ArrowRight className="w-4 h-4" />}
                loading={loading}
                disabled={loading || !form.watch("price") || form.watch("price") <= 0 || !form.watch("quantity") || form.watch("quantity") < 1}
              >
                {isEdit ? "UPDATE LISTING" : "PUBLISH LISTING"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

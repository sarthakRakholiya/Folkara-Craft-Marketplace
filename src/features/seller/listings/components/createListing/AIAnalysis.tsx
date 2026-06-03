"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { CreateListingSchema } from "@/features/seller/listings/hooks/useCreateListingForm";
import { UseFormReturn } from "react-hook-form";
import Image from "next/image";
import { cn } from "@/lib/utils";
import gsap from "gsap";

import { useSearchParams, useRouter } from "next/navigation";
import { 
  generateProductNarrativeAction, 
  createDraftProductAction 
} from "@/features/seller/listings/actions/product.actions";
import { toast } from "sonner";

interface AIAnalysisProps {
  form: UseFormReturn<CreateListingSchema>;
  onComplete: (id: string) => void;
  onBack: () => void;
}

export function AIAnalysis({ form, onComplete, onBack }: AIAnalysisProps) {
  const [isDone, setIsDone] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get("id");
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const messages = [
    "Observing your craft...",
    "Analyzing materials and textures...",
    "Understanding the artisan details...",
    "Drafting your product listing...",
    "Finalizing your product details...",
  ];

  // Memoize previews
  const previews = useMemo(() => {
    const images = form.getValues("images");
    if (!images || images.length === 0) return [];
    return images.map((file: any) => 
      file instanceof File ? URL.createObjectURL(file) : file.url
    );
  }, [form]);

  // Breathing animation for the aura
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (auraRef.current) {
        gsap.to(auraRef.current, {
          scale: 1.1,
          opacity: 0.6,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      if (imageRef.current) {
        gsap.to(imageRef.current, {
          scale: 1.02,
          duration: 5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    });

    return () => ctx.revert();
  }, []);

  // Message rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMessageIndex((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const analysisStarted = useRef(false);

  useEffect(() => {
    if (analysisStarted.current) return;
    analysisStarted.current = true;

    async function processListing() {
      try {
        // 1. Prepare images (Convert Files to base64)
        const images = form.getValues("images");
        const base64Images = await Promise.all(
          images.map(img => {
            if (img instanceof File) {
              return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(img);
                reader.onload = () => resolve(reader.result as string);
              });
            }
            return img.url;
          })
        );

        // 2. Create/Update Draft in DB
        const draftResult = await createDraftProductAction({
          images: base64Images as string[],
          productId: productId || undefined,
          description: form.getValues("description"),
        });

        if (!isMounted.current) return;

        if ("error" in draftResult || !("data" in draftResult)) {
          toast.error("Draft Creation Failed", { description: "error" in draftResult ? draftResult.error : "Unknown error" });
          onBack();
          return;
        }

        const id = draftResult.data;

        // 3. Generate Product Narrative (AI)
        // We do not pass base64Images here to avoid Vercel 413 limit.
        // The server action will automatically fetch the Cloudinary URLs from the DB draft.
        const aiResult = await generateProductNarrativeAction({
          productId: id,
        });

        if (!isMounted.current) return;

        if ("success" in aiResult && aiResult.success && "data" in aiResult) {
          if (!form.getValues("title")) form.setValue("title", aiResult.data.title);
          if (!form.getValues("description")) form.setValue("description", aiResult.data.description);
          if (!form.getValues("category")) form.setValue("category", aiResult.data.category);
          if (!form.getValues("tags")?.length) form.setValue("tags", aiResult.data.tags);
          
          onComplete(id);
        } else if ("error" in aiResult) {
          toast.error("AI Analysis Failed", { description: aiResult.error });
          onComplete(id); // Continue anyway, keep blank
        }
      } catch (error) {
        if (!isMounted.current) return;
        console.error("AI Analysis process error:", error);
        toast.error("Something went wrong");
        onBack();
      }
    }

    processListing();
  }, [productId, form, onComplete, onBack]);

  return (
    <div ref={containerRef} className="max-w-4xl mx-auto py-12 md:py-24 px-4 min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="relative mb-16">
        {/* Atmospheric Aura */}
        <div 
          ref={auraRef}
          className="absolute inset-[-40px] rounded-full bg-primary/5 blur-3xl opacity-40 transition-all duration-1000"
        />
        <div className="absolute inset-[-20px] rounded-full bg-primary/10 blur-2xl opacity-30" />
        
        {/* Product Image */}
        <div 
          ref={imageRef}
          className="relative w-48 h-48 md:w-64 md:h-64 rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/20 bg-surface-container-low"
        >
          {previews[0] ? (
            <Image 
              src={previews[0]} 
              alt="Analyzing..." 
              fill
              className="object-cover opacity-90 transition-opacity duration-1000" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary/20 animate-spin" />
            </div>
          )}
          
          {/* Overlay Light Sweep */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-white/10" />
        </div>

        {/* Floating Sparkles */}
        <div className="absolute -top-3 -right-3 w-10 h-10 bg-surface-container-lowest rounded-full shadow-lg border border-primary/5 flex items-center justify-center animate-bounce">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
      </div>

      {/* Narrative Section */}
      <div className="space-y-8 max-w-lg mx-auto">
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-3 opacity-40">
            <span className="font-label-caps text-[10px] text-primary uppercase font-bold tracking-[0.3em]">AI Guide</span>
            <span className="h-px w-8 bg-primary/30"></span>
            <span className="font-label-caps text-[10px] text-primary uppercase font-bold tracking-[0.3em]">Observation</span>
          </div>
          <h1 className="font-display-lg text-2xl md:text-3xl text-primary tracking-tight italic">
            &quot;{messages[activeMessageIndex]}&quot;
          </h1>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
            <p className="font-body-sm text-[11px] text-on-surface-variant/60 uppercase tracking-[0.2em] font-bold">
              Drafting your product
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Sparkles, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function StepLoader() {
  const auraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (auraRef.current) {
        gsap.to(auraRef.current, {
          scale: 1.2,
          opacity: 0.4,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] w-full animate-in fade-in duration-700">
      <div className="relative mb-6">
        <div 
          ref={auraRef}
          className="absolute inset-[-20px] rounded-full bg-primary/5 blur-xl opacity-20" 
        />
        <div className="relative w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-primary/5">
          <Sparkles className="w-6 h-6 text-primary animate-pulse" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Loader2 className="w-4 h-4 text-primary animate-spin" />
        <span className="font-label-caps text-[11px] text-primary font-bold tracking-[0.3em] uppercase">
          Drafting your product...
        </span>
      </div>
    </div>
  );
}

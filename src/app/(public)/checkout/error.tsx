"use client";

import { useEffect } from "react";

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Checkout boundary error:", error);
  }, [error]);

  return (
    <div className="w-full max-w-[1140px] mx-auto px-12 py-24 flex flex-col items-center justify-center min-h-[500px] space-y-4">
      <h2 className="font-serif text-2xl text-primary font-normal">Something went wrong</h2>
      <p className="font-sans text-xs text-on-surface-variant/80 max-w-sm text-center">
        There was an unexpected error while preparing your checkout. Let&apos;s try that again.
      </p>
      <button
        onClick={() => reset()}
        className="px-8 py-3 bg-primary text-white rounded-full font-sans text-xs font-bold uppercase tracking-widest hover:bg-primary/95 transition-all cursor-pointer shadow-md"
      >
        Try Again
      </button>
    </div>
  );
}

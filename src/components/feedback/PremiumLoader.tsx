"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export function PremiumLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-surface overflow-hidden">
      {/* Background Soft Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full" />

      <div className="relative flex flex-col items-center gap-7 w-full max-w-xs">
        {/* Logo with Breathing Animation */}
        <div className="relative w-24 h-24 animate-[pulse_3s_ease-in-out_infinite]">
          <Image
            src="/logo.png"
            alt="Folkara Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Dual-Orbital Center-Aligned Premium Spinner */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative flex items-center justify-center w-24 h-24">
            {/* Outer spinning ring - primary color arcs */}
            <div className="absolute w-20 h-20 rounded-full border-[3.5px] border-transparent border-t-primary border-b-primary animate-[spin_1.5s_linear_infinite]" />
            {/* Inner reverse-spinning ring - secondary color arcs */}
            <div className="absolute w-12 h-12 rounded-full border-[2.5px] border-transparent border-l-secondary border-r-secondary animate-[spin_1s_linear_infinite_reverse] opacity-80" />
          </div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] font-medium tracking-[0.2em] uppercase text-on-surface-variant/60"
          >
            Curating Objects
          </motion.span>
        </div>
      </div>

      {/* Decorative Text */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-12 font-serif italic text-on-surface-variant/40 text-sm tracking-wide"
      >
        "Beauty in the unhurried."
      </motion.p>
    </div>
  );
}

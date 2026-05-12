"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export function PremiumLoader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        const diff = Math.random() * 15;
        return Math.min(prev + diff, 100);
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-surface overflow-hidden">
      {/* Background Soft Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 blur-[120px] rounded-full" />

      <div className="relative flex flex-col items-center gap-12 w-full max-w-xs">
        {/* Logo with Breathing Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: 1, 
            scale: [0.95, 1, 0.95],
          }}
          transition={{
            opacity: { duration: 0.8 },
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
          className="relative w-24 h-24"
        >
          <Image
            src="/logo.png"
            alt="Folkara Logo"
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        {/* Progress Container */}
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="w-full h-[2px] bg-outline-variant/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.5 }}
            />
          </div>
          
          <div className="flex justify-between w-full">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] font-medium tracking-[0.2em] uppercase text-on-surface-variant/60"
            >
              Curating Objects
            </motion.span>
            <span className="text-[10px] font-bold tabular-nums text-primary/80">
              {Math.round(progress)}%
            </span>
          </div>
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

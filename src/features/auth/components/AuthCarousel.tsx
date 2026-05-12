"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const carouselImages = [
  {
    src: "/images/pottery.png",
    caption: "True beauty is found in the traces of the hand.",
  },
  {
    src: "/images/linen.png",
    caption: "Woven with intent, worn with pride.",
  },
  {
    src: "/images/wood.png",
    caption: "Nature's grain, refined by craft.",
  },
];

export function AuthCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={carouselImages[index].src}
            alt="Lifestyle"
            width={1920}
            height={1080}
            className="h-full w-full object-cover"
            priority
          />
          {/* Subtle warm overlay */}
          <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent flex items-end p-16">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="max-w-md"
            >
              <p className="font-serif text-white text-3xl mb-4 italic leading-relaxed">
                &quot;{carouselImages[index].caption}&quot;
              </p>
              <div className="h-1 w-12 bg-secondary-container" />
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress indicators */}
      <div className="absolute bottom-8 right-8 flex gap-2">
        {carouselImages.map((_, i) => (
          <div
            key={i}
            className={`h-1 w-8 transition-all duration-500 ${
              i === index ? "bg-white w-12" : "bg-white/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Compass, Sparkles, Filter } from "lucide-react";

interface CraftCategory {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  poeticNote: string;
}

const BROWSE_CATEGORIES: CraftCategory[] = [
  {
    id: "pottery",
    name: "Pottery & Clay",
    category: "Ceramics & Clay",
    description: "Earth and water hand-formed and kiln-hardened in patient fire.",
    imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80",
    poeticNote: "Fingerprints of the artisan immortalized in terracotta and stoneware."
  },
  {
    id: "jewelry",
    name: "Fine Jewelry",
    category: "Fine Jewelry",
    description: "Precious metals and raw gemstones shaped with meticulous devotion.",
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80",
    poeticNote: "Wearable heirlooms reflecting timeless elegance."
  },
  {
    id: "textiles",
    name: "Textiles & Weaving",
    category: "Textiles & Weaving",
    description: "Traditional floor looms interlacing organic threads into structural warmth.",
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
    poeticNote: "Meditation in every warp and weft."
  },
  {
    id: "woodwork",
    name: "Fine Woodworking",
    category: "Fine Woodworking",
    description: "Chiseled walnut, sustainably sourced oak, and patient grain finishes.",
    imageUrl: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80",
    poeticNote: "Honoring the legacy of forest giants in contemporary form."
  },
  {
    id: "painting",
    name: "Fine Art & Canvas",
    category: "Fine Art & Canvas",
    description: "Rich pigments, soft oils, and canvas stories capturing unhurried thoughts.",
    imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
    poeticNote: "Visceral expressions of light and emotion."
  },
  {
    id: "glassblowing",
    name: "Glass Artistry",
    category: "Glass Artistry",
    description: "Molten sand blown and spun under glowing, incandescent heat.",
    imageUrl: "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?auto=format&fit=crop&w=600&q=80",
    poeticNote: "Liquid light captured in transient crystalline vessels."
  },
  {
    id: "leatherwork",
    name: "Leather Craft",
    category: "Leather Craft",
    description: "Vegetable tanned hides hand-stitched with durable, traditional saddle stitches.",
    imageUrl: "https://images.unsplash.com/photo-1590534247854-e97d5e3feef6?auto=format&fit=crop&w=600&q=80",
    poeticNote: "Tactile objects designed to age beautifully over generations."
  },
  {
    id: "candles",
    name: "Home Fragrance",
    category: "Home Fragrance",
    description: "Hand-poured soy wax enriched with pure, woodsy botanical extracts.",
    imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80",
    poeticNote: "Quiet illumination for cozy, intentional spaces."
  },
  {
    id: "floral",
    name: "Botanical Arts",
    category: "Botanical Arts",
    description: "Delicate dried flora and arrangements preservation of nature's geometry.",
    imageUrl: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=600&q=80",
    poeticNote: "Silent sculptural stories from wild pastures."
  },
  {
    id: "paper",
    name: "Paper & Stationery",
    category: "Paper & Stationery",
    description: "Cotton rag paper, hand-pressed fibers, and letterpress deckled cards.",
    imageUrl: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80",
    poeticNote: "The tactile warmth of analog correspondence."
  }
];

export function BrowseView() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = BROWSE_CATEGORIES.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 60, damping: 15 }
    }
  };

  return (
    <div className="bg-background min-h-screen text-on-background selection:bg-secondary-container">
      {/* Editorial Banner */}
      <section className="relative h-[340px] md:h-[420px] flex items-center overflow-hidden border-b border-outline-variant/10">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105 filter brightness-[0.9]"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/50 to-transparent" />
        
        <div className="relative z-10 w-full px-4 md:px-margin-page max-w-container-max mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl space-y-4"
          >
            <span className="text-[10px] font-label-caps tracking-[0.3em] text-secondary font-bold bg-secondary-container/90 px-4 py-1.5 rounded-full inline-block uppercase">
              Browse by Craft
            </span>
            <h1 className="font-serif text-white text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight font-notoSerif">
              Curated <span className="italic">Disciplines</span>
            </h1>
            <p className="text-white/80 max-w-lg text-sm sm:text-base font-sans leading-relaxed">
              Explore our curated disciplines, each hand-formed by master artisans carrying on patient, century-old slow-made traditions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="max-w-container-max mx-auto px-4 md:px-margin-page py-10">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-outline-variant/20 pb-8">
          <div className="relative w-full sm:max-w-md">
            <span className="absolute inset-y-0 left-4 flex items-center text-outline">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search craft disciplines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-surface-container border border-outline-variant/50 focus:border-secondary focus:ring-0 focus:outline-none text-xs font-sans placeholder-outline/70 transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 text-outline text-[11px] font-label-caps tracking-widest font-semibold">
            <Compass size={14} className="text-secondary animate-spin-slow" />
            <span>{filteredCategories.length} DISCIPLINES READY</span>
          </div>
        </div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10"
        >
          {filteredCategories.map((cat) => (
            <motion.div
              key={cat.id}
              variants={cardVariants}
              className="group relative h-[280px] rounded-2xl overflow-hidden shadow-md border border-outline-variant/10 bg-surface-container-low cursor-pointer flex flex-col justify-end"
            >
              {/* Category Background Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />
              </div>

              {/* Category Details Card (Glassmorphism effect) */}
              <div className="relative z-10 p-6 md:p-8 text-white space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-label-caps tracking-[0.2em] bg-secondary text-white font-bold px-2.5 py-1 rounded uppercase">
                    {cat.category}
                  </span>
                </div>
                
                <h3 className="font-serif text-2xl font-normal font-notoSerif group-hover:text-secondary-fixed transition-colors">
                  {cat.name}
                </h3>
                
                <p className="text-xs text-white/80 leading-relaxed font-sans max-w-md">
                  {cat.description}
                </p>

                <p className="text-[10px] text-secondary-fixed-dim/90 font-serif italic max-w-sm line-clamp-1">
                  &quot;{cat.poeticNote}&quot;
                </p>

                {/* Direct Filter Action Link */}
                <div className="pt-2">
                  <Link
                    href={`/explore?categories=["${encodeURIComponent(cat.category)}"]`}
                    className="inline-flex items-center gap-1.5 text-[10px] font-label-caps font-bold tracking-widest text-white border-b border-white/40 pb-0.5 hover:border-secondary hover:text-secondary-fixed-dim transition-all uppercase"
                  >
                    <span>Explore Discipline</span>
                    <Sparkles size={10} className="text-secondary-fixed" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <h4 className="font-serif text-lg text-outline font-semibold font-notoSerif">No disciplines found</h4>
            <p className="text-outline-variant text-xs font-sans">
              Try searching with another keyword or discover other slow-made crafts.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

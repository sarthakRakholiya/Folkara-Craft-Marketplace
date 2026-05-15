"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import {
  Sparkles,
  Users,
  ChevronRight,
  ArrowRight,
  BookOpen,
  MessageSquare,
  Truck,
  Star,
} from "lucide-react";
import { gsap } from "gsap";
import { useSession } from "@/hooks/useSession";
import { Button } from "@/components/ui/Button";

export function BuyerDashboardView() {
  const { data: session } = useSession();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP animations removed as per user request to prevent layout shifting issues
  }, []);

  return (
    <div
      ref={containerRef}
      className="px-margin-page pt-10 pb-24 max-w-[1400px] mx-auto overflow-x-hidden min-h-screen"
    >
      {/* Welcome & Stats Section */}
      <section className="mb-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface-variant mb-1">
              Welcome back, {session?.firstName || "Arthur"}
            </h3>
            <p className="font-display-lg text-display-lg text-primary">
              Your Collection & Details
            </p>
          </div>
          <p className="text-outline italic font-body-md mb-2 animate-up">
            Established June 2023
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          {/* Pieces in Collection */}
          <div className="md:col-span-4 bg-surface-container-low p-10 rounded-xl transition-all hover:bg-surface-bright flex flex-col justify-between h-64 group animate-up border border-outline-variant/5">
            <BookOpen size={32} className="text-primary" />
            <div>
              <div className="text-6xl font-display-lg text-primary mb-2">
                12
              </div>
              <div className="font-label-caps text-label-caps tracking-widest text-on-surface-variant group-hover:text-primary transition-colors">
                Pieces in Collection
              </div>
            </div>
          </div>

          {/* Artisans Supported */}
          <div className="md:col-span-4 bg-surface-container-low p-10 rounded-xl transition-all hover:bg-surface-bright flex flex-col justify-between h-64 group animate-up border border-outline-variant/5">
            <Users size={32} className="text-primary" />
            <div>
              <div className="text-6xl font-display-lg text-primary mb-2">
                04
              </div>
              <div className="font-label-caps text-label-caps tracking-widest text-on-surface-variant group-hover:text-primary transition-colors">
                Artisans Supported
              </div>
            </div>
          </div>

          {/* Secondary Stats Column */}
          <div className="md:col-span-4 flex flex-col gap-gutter">
            <div className="bg-surface-container-low p-6 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-surface-bright transition-all border border-outline-variant/5 animate-up">
              <div>
                <div className="font-headline-sm text-primary text-lg">
                  08 Items
                </div>
                <div className="font-label-caps text-label-caps tracking-widest text-on-surface-variant">
                  Wishlist
                </div>
              </div>
              <ChevronRight
                size={18}
                className="text-outline group-hover:translate-x-1 transition-transform"
              />
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-surface-bright transition-all border border-outline-variant/5 animate-up">
              <div>
                <div className="font-headline-sm text-primary text-lg">
                  125 pts
                </div>
                <div className="font-label-caps text-label-caps tracking-widest text-on-surface-variant">
                  Rewards Earned
                </div>
              </div>
              <ChevronRight
                size={18}
                className="text-outline group-hover:translate-x-1 transition-transform"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="mb-32">
        <div className="mb-12 border-b border-outline-variant/10 pb-6 animate-up">
          <h3 className="font-display-lg text-4xl text-primary">
            Recent Activity
          </h3>
        </div>
        <div className="space-y-6">
          {/* Activity 1 */}
          <div className="flex items-center justify-between py-4 group animate-up">
            <div className="flex items-center gap-8">
              <div className="h-14 w-14 bg-surface-container-highest/50 flex items-center justify-center rounded-full">
                <Truck size={20} className="text-on-surface-variant/60" />
              </div>
              <div>
                <h5 className="font-headline-sm text-lg mb-1">In Transit</h5>
                <p className="text-on-surface-variant/60 text-sm">
                  The &apos;Luna&apos; Linen Throw is currently making its way
                  to you from Florence.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="font-label-caps text-[9px] text-on-surface-variant/40 uppercase tracking-widest">
                Expected Friday
              </span>
              <Button
                variant="ghost"
                className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline p-0 h-auto"
              >
                Track Order
              </Button>
            </div>
          </div>
          {/* Activity 2 */}
          <div className="flex items-center justify-between py-4 group animate-up">
            <div className="flex items-center gap-8">
              <div className="h-14 w-14 bg-surface-container-highest/50 flex items-center justify-center rounded-full">
                <MessageSquare
                  size={20}
                  className="text-on-surface-variant/60"
                />
              </div>
              <div>
                <h5 className="font-headline-sm text-lg mb-1">
                  Share your thoughts
                </h5>
                <p className="text-on-surface-variant/60 text-sm">
                  How has the &apos;Sol&apos; Candle holder found its place in
                  your home?
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="font-label-caps text-[9px] text-on-surface-variant/40 uppercase tracking-widest">
                Delivered 3d ago
              </span>
              <Button
                variant="ghost"
                className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline p-0 h-auto"
              >
                Write Note
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Piece Section */}
      <section className="mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 relative featured-card">
            <div className="aspect-[4/5] md:aspect-[1/1] lg:aspect-[4/5] overflow-hidden rounded-xl relative shadow-md">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCj5ftFj_56UijPBmr-UqqEUBWCRG_pz85uj1hC2a8_Huun0OcyrPiCwmFFz9q6VoxjS8k0Dvv2jSznuGNp3qBK88meUaBPMkplrWllvhqp9nJL3-bUkLdWeXWqdaZ292Pe25qG041hkXyxt_ayJnLz4Xxo0_npYDlXuIIS2RQU_zot-wyTizG_z8PTuMaL5wrBVoCQBIGHbklTmEwBsXIZRIrhBaQ20D8OZq-KeXi6mKFfIOUTrTAkKgWZeWHLNplTnHdJ_ML4zlA"
                alt="The Osea Pitcher"
                fill
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
            {/* Floating Info Card */}
            <div className="absolute -bottom-8 -right-8 bg-primary p-10 rounded-xl text-white hidden lg:block max-w-sm shadow-2xl border border-white/5">
              <div className="font-label-caps text-[9px] tracking-[0.3em] mb-3 uppercase text-white/60">
                New Arrival
              </div>
              <h4 className="font-headline-md mb-3 italic text-2xl">
                Julian’s Studio
              </h4>
              <p className="font-body-md text-sm text-white/80 leading-relaxed">
                Each piece is fired for 12 hours in a traditional kiln near the
                New Mexican coast.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 animate-up">
            <div className="font-label-caps text-[10px] tracking-[0.3em] text-on-surface-variant/40 mb-4 uppercase">
              Latest Gathered Piece
            </div>
            <h2 className="font-display-lg text-5xl md:text-6xl text-primary mb-8 leading-tight">
              The Osea Pitcher
            </h2>
            <p className="font-body-lg text-lg text-on-surface-variant/80 leading-relaxed mb-10">
              Crafted from salt-rich NM clay, this vessel carries the spirit of
              the high desert and the ocean breeze. Its finish is left raw to
              the touch, inviting a sensory connection to the maker&apos;s wheel
              with every pour.
            </p>
            {/* AI Guide Box */}
            <div className="bg-surface-container-low p-10 rounded-2xl border border-outline-variant/10 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6 text-on-surface-variant">
                  <Sparkles size={16} className="text-on-surface-variant/60" />
                  <span className="font-label-caps text-[10px] tracking-[0.2em] font-bold uppercase opacity-60">
                    THE ARTISAN GUIDE
                  </span>
                </div>
                <p className="font-headline-sm italic text-on-surface-variant leading-relaxed text-xl mb-8 opacity-90">
                  &quot;To elevate the cool tones of the Osea clay, I suggest
                  pairing this with Julian’s hand-carved cedar coasters. The
                  wood’s warmth balances the salt-fired texture perfectly.&quot;
                </p>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-primary font-bold text-sm p-0 h-auto hover:bg-transparent"
                >
                  View the pairing{" "}
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Resonance Card */}
      <section className="animate-up">
        <div className="bg-primary p-12 lg:p-20 rounded-[40px] relative overflow-hidden flex flex-col lg:flex-row items-center gap-16 group">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />

          <div className="w-full lg:w-[400px] aspect-square overflow-hidden rounded-2xl relative shadow-2xl shrink-0">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcv0-hSu0rVluh1m42jx1jHFHxt4D1ExiQAHaySzfga__DuQFKc8tYufsJ1Fz9VFi6Lg-bbDHWy_ndARyxPUU4zA-z99DZ9ee-WYiQix8NeXzYQtVh9qNJZKX5kQ82d7mfRvY95OqnOXIbtrw0YdyjPGVpyroTnKZczdhJSwbUacC-lxQh9gAUxsla9i0Om4XEG9t-mkzikfDeFz7rhL4OKA7a8LfpV9OR8Qayt-9_KYzDyq8dkYhMqjj8Vrg6yFguDrOoAL7qBv4"
              alt="Elena Rossi"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          </div>

          <div className="flex-1 relative z-10 text-white">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles size={16} className="text-white/40" />
              <span className="font-label-caps text-[10px] tracking-[0.3em] text-white/40 uppercase">
                RECOMMENDED RESONANCE
              </span>
            </div>
            <h3 className="font-headline-md text-3xl md:text-5xl mb-8 leading-tight max-w-2xl font-serif italic">
              Based on your appreciation for Julian&apos;s pottery, you might
              find a deep resonance with Elena Rossi&apos;s hand-woven textiles.
            </h3>
            <p className="font-body-lg text-lg text-white/70 mb-12 max-w-xl leading-relaxed">
              Elena uses ancient Tuscan techniques to create linens that possess
              the same tactile earthiness you value in your ceramics.
            </p>
            <Button
              variant="fixed"
              shape="full"
              size="lg"
              className="px-12 py-5 font-label-caps text-xs tracking-[0.3em] transition-all inline-flex items-center gap-4"
            >
              Meet Elena <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

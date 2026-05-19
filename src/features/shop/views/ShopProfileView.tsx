"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Sparkles, AlertCircle } from "lucide-react";
import { ProductCard } from "@/features/explore/components/ProductCard";

interface ShopProfileViewProps {
  initialData: {
    shop: {
      id: string;
      name: string;
      description: string | null;
      logoUrl: string | null;
      createdAt: string | Date;
    };
    seller: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      bio: string | null;
      avatarUrl: string | null;
      onboardingData: any;
    } | null;
    products: any[];
  };
}

export function ShopProfileView({ initialData }: ShopProfileViewProps) {
  const { shop, seller, products } = initialData;

  const artisanName = seller 
    ? `${seller.firstName || ""} ${seller.lastName || ""}`.trim() 
    : "Master Artisan";

  const establishedYear = new Date(shop.createdAt).getFullYear();

  // Onboarding data extraction
  const onboarding = seller?.onboardingData || {};
  const makerQuote = onboarding.makerQuote || shop.description || "Crafting with patience, capturing the nature of raw materials.";
  const location = onboarding.city && onboarding.country 
    ? `${onboarding.city}, ${onboarding.country}` 
    : onboarding.city || onboarding.country || "Aegean Coast";

  // Fallback high-fidelity images for the sun-drenched aesthetic
  const heroBackdropImg = onboarding.workshopImageUrl || "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1600&q=80"; // Aegean Sunset Coastal Village
  const workshopHandsImg = "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80"; // Close up ceramics hands
  const shopLogo = shop.logoUrl || seller?.avatarUrl || "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=400&q=80"; // Elegant pottery close up

  // Map database products to UI Product format for ProductCard
  const mappedProducts = products.map((item) => ({
    id: item.id,
    type: "product" as const,
    title: item.title || "Untitled Masterpiece",
    author: `By ${shop.name}`,
    price: `₹${item.price}`,
    image: item.images?.[0]?.url || "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80",
    badge: undefined,
  }));

  // Split bio into styled paragraphs for editorial layout
  const bioParagraphs = seller?.bio
    ? seller.bio.split("\n\n").filter(p => p.trim().length > 0)
    : [
        "Every piece that leaves our studio is born from a slow, deliberate dialogue between hands and earth. We gather inspiration from the rugged Aegean tides, the sun-baked stones, and the golden hour light that blankets our workshop.",
        "We believe that the objects we surround ourselves with carry energy. By shaping each item individually, we ensure that no two are ever identical—each piece contains its own minor imperfections, variations in glaze, and stories of slow creation."
      ];

  return (
    <main className="w-full bg-background min-h-screen text-on-surface font-sans relative pb-24 mt-20">
      {/* Back Button */}
      <div className="max-w-container-max mx-auto px-margin-page pt-6 md:pt-12">
        <Link
          href="/explore"
          className="flex items-center gap-2 text-primary hover:text-secondary transition-colors group w-fit"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:-translate-x-1" />
          <span className="font-sans text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
            Back to Explore
          </span>
        </Link>
      </div>

      {/* Artisan Hero Banner Section */}
      <section className="max-w-container-max mx-auto px-margin-page py-8 md:py-12">
        <div className="relative rounded-[2.5rem] overflow-hidden aspect-[16/9] md:aspect-[21/9] shadow-lg border border-outline-variant/10">
          {/* Background Image with Warm Golden Hour Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
          <Image
            src={heroBackdropImg}
            alt={`${shop.name} Workshop Banner`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center grayscale-[15%] brightness-[95%]"
          />

          {/* Hero Content Overlay */}
          <div className="absolute bottom-0 inset-x-0 z-20 p-6 md:p-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-6">
              {/* Profile Logo Circular HUD */}
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border-2 border-accent bg-surface-container-low overflow-hidden relative shrink-0 shadow-md">
                <Image
                  src={shopLogo}
                  alt={`${shop.name} Logo`}
                  fill
                  sizes="(max-width: 768px) 80px, 112px"
                  className="object-cover"
                />
              </div>

              {/* Text Info */}
              <div className="space-y-1 md:space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-sans text-[9px] md:text-[10px] font-bold text-accent tracking-[0.3em] uppercase">
                    Certified Folkara Studio
                  </span>
                </div>
                <h1 className="font-serif text-3xl md:text-5xl text-white tracking-wide">
                  {shop.name}
                </h1>
                
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-sans text-xs md:text-sm text-white/80">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-accent" />
                    {location}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 hidden sm:inline-block"></span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-accent" />
                    Est. {establishedYear}
                  </span>
                </div>
              </div>
            </div>

            {/* Signature Maker Quote Box */}
            <div className="md:max-w-xs bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-sm hidden md:block">
              <span className="font-serif text-4xl text-accent/20 absolute -top-1 left-2 pointer-events-none">“</span>
              <p className="font-serif italic text-sm text-white/90 leading-relaxed pl-3 relative z-10">
                {makerQuote}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Maker Story Section */}
      <section className="max-w-container-max mx-auto px-margin-page py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-gutter items-center">
          {/* Column 1: Editorial Portrait Shot */}
          <div className="md:col-span-5 relative order-2 md:order-1">
            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-xl border border-outline-variant/10 relative group">
              <Image
                src={workshopHandsImg}
                alt={`${artisanName} in studio`}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors duration-1000"></div>
            </div>

            {/* Organic styled floating badge */}
            <div className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground p-6 shadow-lg rounded-3xl hidden md:block max-w-[200px] border border-outline-variant/10">
              <p className="font-serif italic text-lg leading-snug">
                &ldquo;Pure clay, slow fired.&rdquo;
              </p>
              <p className="font-sans text-[9px] font-bold tracking-widest uppercase mt-2 opacity-80">
                Artisan Philosophy
              </p>
            </div>
          </div>

          {/* Column 2: The Bio Narrative */}
          <div className="md:col-span-7 flex flex-col gap-6 md:gap-8 md:pl-12 order-1 md:order-2">
            <div className="flex flex-col gap-3">
              <span className="font-sans text-[10px] md:text-xs font-bold text-secondary tracking-[0.4em] uppercase">
                Meet the Artisan
              </span>
              <h2 className="font-serif text-3xl md:text-display-md text-primary leading-tight">
                Crafted by {artisanName}
              </h2>
            </div>

            <div className="space-y-6">
              {bioParagraphs.map((para, index) => (
                <p 
                  key={index}
                  className="font-sans text-base md:text-lg text-on-surface-variant leading-relaxed first-of-type:text-primary font-medium"
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Mobilized signature quote */}
            <div className="bg-surface-container-low border-l-2 border-secondary p-5 rounded-r-2xl md:hidden">
              <p className="font-serif italic text-base text-primary">
                &ldquo;{makerQuote}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Current Firing Section (Active Products Grid) */}
      <section className="max-w-container-max mx-auto px-margin-page py-12 md:py-24 border-t border-outline-variant/10">
        <div className="flex flex-col gap-12 md:gap-16">
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="flex items-center gap-2">
              <span className="font-sans text-[10px] md:text-xs font-bold text-secondary tracking-[0.4em] uppercase">
                Available Catalog
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <h2 className="font-serif text-3xl md:text-display-sm text-primary max-w-xl">
                The Current Firing
              </h2>
              <p className="font-sans text-xs md:text-sm text-on-surface-variant italic">
                Showing {mappedProducts.length} slow-made creations
              </p>
            </div>
          </div>

          {mappedProducts.length === 0 ? (
            <div className="text-center py-20 px-4 bg-surface-container-low/40 rounded-3xl border border-dashed border-outline-variant/30 flex flex-col items-center gap-4 max-w-2xl mx-auto">
              <AlertCircle className="w-8 h-8 text-secondary/60" />
              <p className="text-xl text-primary font-serif italic">
                Studio cooling down...
              </p>
              <p className="text-sm text-on-surface-variant max-w-sm">
                This artisan does not have any active products listed right now. Check back soon for their next kiln firing.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-gutter">
              {mappedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Curator's Note Box Section */}
      <section className="max-w-container-max mx-auto px-margin-page pt-12">
        <div className="relative bg-surface-container p-8 md:p-12 rounded-[2rem] border border-outline-variant/20 overflow-hidden shadow-sm flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Decorative organic background */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-secondary-container/20 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>

          <div className="shrink-0 w-14 h-14 rounded-full bg-accent text-accent-foreground flex items-center justify-center relative shadow-sm border border-outline-variant/20">
            <Sparkles className="w-6 h-6 text-secondary" />
          </div>

          <div className="space-y-4 relative z-10 flex-grow text-center md:text-left">
            <h4 className="font-serif italic text-2xl text-secondary">
              A Curator’s Note on {shop.name}
            </h4>
            <p className="font-sans text-body-md text-on-surface-variant leading-relaxed max-w-3xl">
              By collecting from {shop.name}, you are intentionally choosing to support heritage methods of making. Every piece is slow-fired in batches, ensuring low energy footprint, organic source materials, and direct fair-trade artisan compensation. Because of this, small discrepancies in form, shade, and glaze are natural marks of authenticity.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

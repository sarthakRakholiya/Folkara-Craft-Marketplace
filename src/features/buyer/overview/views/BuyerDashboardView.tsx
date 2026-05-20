"use client";

import React from "react";
import Image from "next/image";
import {
  Sparkles,
  Users,
  ArrowRight,
  BookOpen,
  Star,
  ShoppingBag,
} from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { Button } from "@/components/ui/Button";
import { useBuyerOrdersQuery } from "@/features/buyer/orders/hooks/useBuyerOrders";
import { useFavoritesListQuery } from "@/features/products/hooks/useFavorite";
import { getBuyerProfile } from "@/features/auth/actions/profile.actions";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function BuyerDashboardView() {
  const router = useRouter();
  const { data: session } = useSession();
  const { data, isLoading: isOrdersLoading } = useBuyerOrdersQuery();
  const orders = data?.orders || [];
  const { data: favorites = [], isLoading: isFavoritesLoading } = useFavoritesListQuery();
  
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["buyerProfile"],
    queryFn: () => getBuyerProfile(),
  });

  const isLoading = isOrdersLoading || isFavoritesLoading || isProfileLoading;

  // Render shimmer states
  if (isLoading) {
    return (
      <div className="px-margin-page pt-10 pb-24 max-w-[1400px] mx-auto min-h-screen space-y-16 animate-pulse">
        <div className="space-y-4 mb-8">
          <div className="h-8 bg-surface-container-highest rounded w-1/4"></div>
          <div className="h-12 bg-surface-container-highest rounded w-1/2"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <div className="h-64 bg-surface-container-highest rounded-xl"></div>
          <div className="h-64 bg-surface-container-highest rounded-xl"></div>
          <div className="h-64 bg-surface-container-highest rounded-xl"></div>
        </div>

        <div className="space-y-6">
          <div className="h-10 bg-surface-container-highest rounded w-1/3 border-b pb-6"></div>
          <div className="h-20 bg-surface-container-highest rounded-lg"></div>
          <div className="h-20 bg-surface-container-highest rounded-lg"></div>
        </div>
      </div>
    );
  }

  // Aggregate stats
  const ordersCount = orders?.length || 0;
  const uniqueArtisansCount = Array.from(
    new Set(orders?.map((o) => o.artisan).filter(Boolean))
  ).length;
  const wishlistCount = favorites?.length || 0;

  const estDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "June 2023";

  const latestItem = ordersCount > 0 ? orders[0] : null;

  return (
    <div className="px-margin-page pt-10 pb-24 max-w-[1400px] mx-auto overflow-x-hidden min-h-screen">
      {/* Welcome & Stats Section */}
      <section className="mb-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface-variant mb-1">
              Welcome back, {profile?.firstName || session?.firstName || "Arthur"}
            </h3>
            <p className="font-display-lg text-display-lg text-primary">
              Your Collection & Details
            </p>
          </div>
          <p className="text-outline italic font-body-md mb-2 animate-up">
            Established {estDate}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {/* Pieces in Collection */}
          <div className="bg-surface-container-low p-10 rounded-xl transition-all hover:bg-surface-bright flex flex-col justify-between h-64 group border border-outline-variant/5">
            <BookOpen size={32} className="text-primary" />
            <div>
              <div className="text-6xl font-display-lg text-primary mb-2">
                {String(ordersCount).padStart(2, "0")}
              </div>
              <div className="font-label-caps text-label-caps tracking-widest text-on-surface-variant group-hover:text-primary transition-colors">
                Pieces in Collection
              </div>
            </div>
          </div>

          {/* Artisans Supported */}
          <div className="bg-surface-container-low p-10 rounded-xl transition-all hover:bg-surface-bright flex flex-col justify-between h-64 group border border-outline-variant/5">
            <Users size={32} className="text-primary" />
            <div>
              <div className="text-6xl font-display-lg text-primary mb-2">
                {String(uniqueArtisansCount).padStart(2, "0")}
              </div>
              <div className="font-label-caps text-label-caps tracking-widest text-on-surface-variant group-hover:text-primary transition-colors">
                Artisans Supported
              </div>
            </div>
          </div>

          {/* Wishlist Items */}
          <div 
            onClick={() => router.push("/favorites")}
            className="bg-surface-container-low p-10 rounded-xl transition-all hover:bg-surface-bright flex flex-col justify-between h-64 group cursor-pointer border border-outline-variant/5"
          >
            <Star size={32} className="text-primary" />
            <div>
              <div className="text-6xl font-display-lg text-primary mb-2">
                {String(wishlistCount).padStart(2, "0")}
              </div>
              <div className="font-label-caps text-label-caps tracking-widest text-on-surface-variant group-hover:text-primary transition-colors">
                Wishlist Items
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="mb-24">
        <div className="mb-12 border-b border-outline-variant/10 pb-6">
          <h3 className="font-display-lg text-4xl text-primary">
            Recent Activity
          </h3>
        </div>

        {ordersCount === 0 ? (
          <div className="text-center py-16 px-6 bg-surface-container-low rounded-3xl border border-outline-variant/10 max-w-md mx-auto space-y-6">
            <div className="w-14 h-14 bg-surface-container-highest flex items-center justify-center rounded-full mx-auto">
              <ShoppingBag size={24} className="text-primary" />
            </div>
            <div className="space-y-1">
              <h4 className="font-serif text-xl text-slate-800 font-semibold">Your collection is empty</h4>
              <p className="text-on-surface-variant/80 text-xs max-w-sm mx-auto leading-relaxed">
                Explore the discovery feed to find unique, slow-made creations and stories from our artisan partners.
              </p>
            </div>
            <Button
              variant="fixed"
              shape="full"
              onClick={() => router.push("/explore")}
              className="px-8 py-3.5 text-[10px] tracking-widest font-label-caps inline-flex items-center gap-2 mx-auto"
            >
              Browse Discovery Feed <ArrowRight size={14} />
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.slice(0, 3).map((item) => {
              const isDelivered = item.status === "DELIVERED";
              
              return (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-6 border-b border-outline-variant/10 gap-4 group">
                  <div className="flex items-center gap-6">
                    <div className="h-16 w-16 bg-surface-container-highest flex items-center justify-center rounded-xl overflow-hidden relative shrink-0 border border-outline-variant/5">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h5 className="font-headline-sm text-lg mb-1 flex items-center gap-2 text-slate-800">
                        {isDelivered ? "Delivered" : "In Transit"}
                        <span className="text-xs text-on-surface-variant/40 font-normal font-sans">
                          #{item.id.slice(-5).toUpperCase()}
                        </span>
                      </h5>
                      <p className="text-on-surface-variant/75 text-sm">
                        {isDelivered 
                          ? `How has the '${item.title}' found its place in your home?`
                          : `Your '${item.title}' is on its way to you from ${item.artisan}.`
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="font-label-caps text-[9px] text-on-surface-variant/40 uppercase tracking-widest">
                      {isDelivered 
                        ? `Delivered ${item.deliveredDate || 'recently'}` 
                        : `Expected ${item.arrivalDate || 'soon'}`
                      }
                    </span>
                    <Button
                      variant="ghost"
                      onClick={() => router.push(`/buyer/orders`)}
                      className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline p-0 h-auto"
                    >
                      {isDelivered ? "Write Note" : "Track Order"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Conditionally Rendered Latest Piece & Recommendation (Pruned when no orders) */}
      {latestItem && (
        <>
          {/* Featured Piece Section */}
          <section className="mb-32">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-7 relative featured-card">
                <div className="aspect-[4/5] md:aspect-[1/1] lg:aspect-[4/5] overflow-hidden rounded-xl relative shadow-md">
                  <Image
                    src={latestItem.image}
                    alt={latestItem.title}
                    fill
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>
                {/* Floating Info Card */}
                <div className="absolute -bottom-8 -right-8 bg-primary p-10 rounded-xl text-white hidden lg:block max-w-sm shadow-2xl border border-white/5">
                  <div className="font-label-caps text-[9px] tracking-[0.3em] mb-3 uppercase text-white/60">
                    Latest Collection Addition
                  </div>
                  <h4 className="font-headline-md mb-3 italic text-2xl">
                    {latestItem.artisan}
                  </h4>
                  <p className="font-body-md text-sm text-white/80 leading-relaxed line-clamp-3">
                    {latestItem.description || "A beautiful slow-crafted relic that captures the essence of pure craftsmanship."}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="font-label-caps text-[10px] tracking-[0.3em] text-on-surface-variant/40 mb-4 uppercase">
                  Latest Gathered Piece
                </div>
                <h2 className="font-display-lg text-5xl md:text-6xl text-primary mb-8 leading-tight">
                  {latestItem.title}
                </h2>
                <p className="font-body-lg text-lg text-on-surface-variant/80 leading-relaxed mb-10">
                  {latestItem.description || "Crafted with dedication and pure technique, this piece holds the unique spirit of authentic making and represents the heart of artisan tradition."}
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
                      &quot;{latestItem.artisanAnalysis || `To appreciate the tactile textures of this relic, we suggest placing it in a well-lit space where natural light highlights the artisan's intricate detailing.`}&quot;
                    </p>
                    <Button
                      variant="ghost"
                      onClick={() => router.push(`/explore`)}
                      className="flex items-center gap-2 text-primary font-bold text-sm p-0 h-auto hover:bg-transparent"
                    >
                      Explore other creations{" "}
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
        </>
      )}
    </div>
  );
}

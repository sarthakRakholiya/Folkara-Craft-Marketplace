"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ShoppingBag, Heart, Clock, Settings, ArrowRight } from "lucide-react";

interface BuyerViewProps {
  user: {
    firstName?: string | null;
    lastName?: string | null;
    avatarUrl?: string | null;
  };
}

export function BuyerView({ user }: BuyerViewProps) {
  const stats = [
    { label: "Active Orders", value: "2", icon: ShoppingBag, color: "bg-primary/10 text-primary" },
    { label: "Saved Items", value: "14", icon: Heart, color: "bg-secondary/10 text-secondary" },
    { label: "Journal Entries", value: "5", icon: Clock, color: "bg-tertiary/10 text-tertiary" },
  ];

  const recentOrders = [
    {
      id: "ORD-9482",
      shop: "Amber & Earth",
      item: "Hand-thrown Pitcher",
      price: "$124.00",
      status: "In Transit",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZyjBFms7uSYsSne-yGEyhAYdqCHraTXx2cHnvtrRXkQkMz2qYb5PEjHQvDJwMA5uX7mY0QqMYwbJ54QJP08Bpl9PvgAQ85YScfAgy0vQEjZYzBizoMFdZyhRQwbUt8KnNwyhoZnBhXRE2jMOaUrXSSIMjwTQgWFtTSHormmzb-xDYnLMjO0NqkfFQuN41h0eXqcoCcISKJ1q9As6bAv70m7jscIw9xgiIdTBRRYXplCQwOHb2-WSHtNV1jmETbiHWYchdznQeDrw"
    },
    {
      id: "ORD-9479",
      shop: "Indigo Weaves",
      item: "Organic Cotton Runner",
      price: "$85.00",
      status: "Delivered",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAXjCe3zSqIcySaZ13nk3brQ3Xu4EwnJTONKpD26J2xQkdMzJDUXG6r7UbWwzPUv7mWGieod3OuJ1-NDNtsRCGiZeAEbp78RBx47wB8dgQNCPNMEs-gzCLaXxWExQzxFvAnGKk8ah6fNeZRwgCf2A8KULTO9JjjwpdlF6IJBV-NWJwklM-q_ePesRlOVocgYIO2VcLCpGxQ7b931-frIwnJADcZPzhlz-ifbAaqf5xS5-c3AEdO_Uf7b_PPhVIEvXjL8_KfXclWoWw"
    }
  ];

  return (
    <div className="px-4 md:px-margin-page py-8 md:py-16 space-y-12 md:space-y-16 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="font-serif text-3xl md:text-5xl text-primary tracking-tight">
            Welcome back, {user.firstName || "Friend"}
          </h1>
          <p className="text-on-surface-variant text-sm md:text-base max-w-lg">
            Your collection of intentional objects and artisan stories is growing.
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-outline-variant hover:bg-surface-container-low transition-colors group">
          <Settings className="w-4 h-4 text-on-surface-variant group-hover:rotate-90 transition-transform duration-500" />
          <span className="font-sans text-xs font-bold uppercase tracking-widest text-on-surface-variant">Profile Settings</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface-container-low p-8 rounded-[32px] border border-outline-variant/10 shadow-sm flex items-center gap-6 group hover:shadow-md transition-all">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="font-serif text-2xl md:text-3xl text-on-surface">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Orders - 2/3 width on desktop */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-2xl md:text-3xl text-on-surface">Recent Orders</h2>
            <button className="font-sans text-[10px] font-bold text-primary uppercase tracking-widest hover:underline underline-offset-4">View All History</button>
          </div>

          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="bg-surface-container-low p-4 rounded-[24px] border border-outline-variant/10 flex flex-col sm:flex-row items-center gap-6 group hover:bg-surface-container-high/30 transition-colors">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden relative shrink-0">
                  <Image src={order.image} alt={order.item} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="flex-1 min-w-0 space-y-1 text-center sm:text-left">
                  <p className="font-label-caps text-[10px] text-secondary uppercase tracking-widest">{order.shop}</p>
                  <h3 className="font-serif text-lg md:text-xl text-on-surface truncate">{order.item}</h3>
                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 mt-2">
                    <span className="text-xs text-on-surface-variant">{order.id}</span>
                    <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                    <span className="text-xs font-bold text-on-surface">{order.price}</span>
                  </div>
                </div>
                <div className="flex flex-col items-center sm:items-end gap-3 px-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                    order.status === "Delivered" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
                  )}>
                    {order.status}
                  </span>
                  <button className="p-2 rounded-full border border-outline-variant hover:bg-surface transition-colors">
                    <ArrowRight className="w-4 h-4 text-on-surface-variant" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Curation Card - 1/3 width on desktop */}
        <div className="space-y-8">
          <h2 className="font-serif text-2xl md:text-3xl text-on-surface">Curated for you</h2>
          <div className="bg-primary-container p-8 rounded-[40px] relative overflow-hidden group min-h-[400px] flex flex-col justify-end">
            <div className="absolute inset-0 grayscale opacity-20 transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-40">
              <Image 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNWvA8My1SWFcH0fciJTtT4ZlaGIChpcKxQyZcewyXadXqOn81cW3cebsEEH9cCB6xv4pXH_6g5N67ylTurhF1q6Db4EjWT8ZGK9SMOI1jK4kz2c7PZksqkygfAgDlEe89N7bJItS3_k1Gq2zHUKUg_k_LseNWTIN2VRZan9ZFQcdmCOYhgl-KfraqjLT5PUpx-PVNNHgq0ss8XHPNnQtZjSXvyl0pgrQp6ROvFGgGebrbKHHs_EiGQ5ak6MzxV7g9G6jD-C6NnJw" 
                alt="Curated" 
                fill 
                className="object-cover" 
              />
            </div>
            <div className="relative z-10 space-y-4">
              <p className="font-label-caps text-[10px] text-on-primary-container uppercase tracking-[0.2em]">Weekly Journal</p>
              <h3 className="font-serif text-2xl md:text-3xl text-on-primary-container leading-tight">Finding beauty in the imperfect.</h3>
              <p className="text-sm text-on-primary-container/80 leading-relaxed">Discover how Japanese Wabi-Sabi is influencing modern ceramicists in our latest artisan feature.</p>
              <button className="w-full py-4 bg-primary text-on-primary rounded-full font-sans text-xs font-bold uppercase tracking-widest mt-4 shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                Read Story
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

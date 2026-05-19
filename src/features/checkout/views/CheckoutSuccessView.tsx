"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  CheckCircle2 as _CheckCircle2,
  Sparkles,
  ArrowRight,
  Truck,
  BookOpen,
  ShoppingBag as _ShoppingBag,
} from "lucide-react";
import { AnimatedCheckIcon } from "@/assets/icons/AnimatedCheckIcon";

interface CheckoutSuccessViewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  order: any;
}

export function CheckoutSuccessView({ order }: CheckoutSuccessViewProps) {
  // Helper to format currency in INR
  const formatCurrency = (amount: string | number) => {
    return parseFloat(amount.toString()).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    });
  };

  if (!order) return null;

  const deliveryMethod = order.deliveryMethod || "standard";

  // Calculate dynamic estimated arrival range: standard 5-7 days, express 1-3 days
  const today = new Date();
  const minDays = deliveryMethod === "express" ? 1 : 5;
  const maxDays = deliveryMethod === "express" ? 3 : 7;

  const minDate = new Date(today);
  minDate.setDate(today.getDate() + minDays);
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + maxDays);

  const options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };
  const arrivalRangeStr = `${minDate.toLocaleDateString("en-US", options)} — ${maxDate.toLocaleDateString("en-US", options)}`;

  // High-fidelity fallback image for Stripe checkout / placeholder cases
  const fallbackImg =
    "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80";

  // Dynamic content based on first item
  const firstItem = order.items?.[0];
  const firstItemTitle = firstItem?.product?.title || "slow-made object";
  const firstItemShop = firstItem?.shop?.name || "Independent Workshop";

  // Dynamic personalized note from "Folkara Guide"
  const artisanGuideNote = `Thank you for buying the ${firstItemTitle.toLowerCase()} from ${firstItemShop}. We hope you love it! Your item is packed carefully and will be on its way soon.`;

  return (
    <main className="min-h-screen bg-background text-on-background font-sans mt-24">
      {/* Hero Celebration Section */}
      <section className="relative flex flex-col items-center justify-center pt-section-gap pb-12 px-margin-page text-center overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-60 pointer-events-none bg-[radial-gradient(circle,_rgba(254,210,169,0.4)_0%,_rgba(251,249,244,0)_70%)] blur-[20px]"></div>

        <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl">
          {/* Sparkle/Check Icon */}
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-surface-container-low flex items-center justify-center relative shadow-sm border border-outline-variant/10">
              <AnimatedCheckIcon className="w-12 h-12 text-primary" />
            </div>
            <Sparkles className="w-6 h-6 text-secondary absolute -top-2 -right-2 animate-pulse" />
            <Sparkles className="w-4 h-4 text-primary/40 absolute -bottom-1 -left-4" />
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-serif text-display-lg text-primary"
          >
            Your order has been placed
          </motion.h1>

          <p className="font-sans text-body-lg text-on-surface-variant max-w-lg">
            You’re supporting independent craftsmanship around the world. Your
            intentional choice helps keep ancient traditions alive.
          </p>

          <div className="mt-8">
            <Link
              href="/buyer/orders"
              className="bg-primary text-white px-10 py-4 rounded-lg font-sans text-label-caps hover:opacity-90 transition-all flex items-center gap-2"
            >
              Track Your Order
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Order Summary & Content Grid */}
      <section className="max-w-[1140px] mx-auto px-margin-page py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          {/* Left: Order Details */}
          <div className="lg:col-span-7 flex flex-col gap-gutter">
            <div className="bg-surface-container-low p-8 rounded-xl shadow-sm border border-outline-variant/10">
              <h2 className="font-serif text-2xl text-primary mb-6">
                Order Summary
              </h2>

              <div className="space-y-6 max-h-[380px] overflow-y-auto pr-2 scrollbar-thin">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {order.items?.map((item: any) => {
                  const product = item.product;
                  if (!product) return null;
                  const itemImg = product.images?.[0]?.url || fallbackImg;
                  const shopName = item.shop?.name || firstItemShop;

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-6 pb-6 border-b border-outline-variant/20 last:border-0 last:pb-0"
                    >
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-surface-dim relative shrink-0 border border-outline-variant/20">
                        <Image
                          src={itemImg}
                          alt={product.title || "Craft product"}
                          fill
                          sizes="96px"
                          className="object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-300"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-sans text-body-lg font-semibold text-primary">
                          {product.title}
                        </h3>
                        <p className="text-on-surface-variant font-sans text-sm italic">
                          Hand-made by {shopName}
                        </p>
                        <div className="flex justify-between items-end mt-1 text-sm text-on-surface-variant font-sans">
                          <span>Qty: {item.quantity}</span>
                          <span className="font-bold text-primary">
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Calculations Block */}
              <div className="mt-8 pt-8 border-t border-outline-variant/30 space-y-3 font-sans text-sm">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Shipping</span>
                  <span>
                    {parseFloat(order.shippingCost) === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      formatCurrency(order.shippingCost)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>GST (18%)</span>
                  <span>{formatCurrency(order.tax ?? 0)}</span>
                </div>
                <div className="flex justify-between text-primary font-bold text-lg pt-2 border-t border-outline-variant/10">
                  <span>Total</span>
                  <span>{formatCurrency(order.grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Progress Teaser */}
            <div className="bg-primary p-8 rounded-xl text-on-primary-container flex items-center justify-between shadow-sm">
              <div className="font-sans">
                <p className="text-label-caps uppercase tracking-widest opacity-80 mb-1">
                  Estimated Arrival
                </p>
                <p className="font-serif text-2xl font-medium text-white">
                  {arrivalRangeStr}
                </p>
              </div>
              <Truck
                className="w-10 h-10 text-white opacity-95 shrink-0"
                strokeWidth={1.5}
              />
            </div>
          </div>

          {/* Right: Editorial Side Content */}
          <div className="lg:col-span-5 flex flex-col gap-gutter">
            {/* The AI Guide Suggestion */}
            <div className="relative bg-surface p-8 rounded-xl border border-secondary-container/50 overflow-hidden shadow-sm">
              <div className="absolute top-4 right-4">
                <Sparkles className="w-5 h-5 text-secondary animate-[pulse_3s_infinite]" />
              </div>
              <h4 className="font-serif italic text-2xl text-secondary mb-4">
                A note for your new space...
              </h4>
              <p className="font-sans text-body-md text-on-surface-variant leading-relaxed mb-6">
                &ldquo;{artisanGuideNote}&rdquo;
              </p>
              <div className="flex items-center gap-2 text-secondary font-sans text-label-caps">
                <span className="w-8 h-[1px] bg-secondary"></span>
                Your Folkara Guide
              </div>
            </div>

            {/* Workshop Glimpse */}
            <div className="group cursor-pointer">
              <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-outline-variant/20">
                <Image
                  src="https://images.unsplash.com/photo-1541250848049-b4f7141dca3f?auto=format&fit=crop&w=800&q=80"
                  alt="Sunny studio filled with organic materials and hand-made clay pots"
                  fill
                  sizes="400px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors"></div>
              </div>
              <h3 className="font-serif text-2xl text-primary group-hover:text-secondary transition-colors duration-300">
                Meet the Makers
              </h3>
              <p className="font-sans text-body-md text-on-surface-variant mt-2 leading-relaxed">
                See how your handmade items were crafted with skill by {firstItemShop}.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final Narrative Action */}
      <section className="bg-surface-container-high py-16 px-margin-page text-center">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-4">
          <BookOpen className="w-8 h-8 text-secondary mb-2" strokeWidth={1.5} />
          <h2 className="font-serif text-3xl text-primary">Share the Story</h2>
          <p className="font-sans text-body-md text-on-surface-variant max-w-lg mb-4">
            By choosing artisan-made, you’re telling a different story about how
            things are made. Share your new finds and join a community of
            intentional collectors.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/explore"
              className="border border-secondary text-secondary hover:bg-secondary hover:text-white px-8 py-3 rounded-lg font-sans text-label-caps transition-all inline-block"
            >
              Follow our Journey
            </Link>
            <Link
              href="/"
              className="bg-white border border-outline-variant/30 text-primary hover:bg-surface-container-low px-8 py-3 rounded-lg font-sans text-label-caps transition-all inline-block"
            >
              Invite a Friend
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

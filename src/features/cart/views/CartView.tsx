"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Sparkles,
  Check,
} from "lucide-react";
import {
  useCartQuery,
  useUpdateQuantityMutation,
  useRemoveItemMutation,
  useMoveToCartMutation,
} from "../hooks/useCart";
import { useFavoritesListQuery } from "@/features/products/hooks/useFavorite";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function CartView() {
  const router = useRouter();
  const { data: cartItems = [], isLoading: isCartLoading } = useCartQuery();
  const { data: favorites = [] } = useFavoritesListQuery();

  const { mutate: updateQuantity } = useUpdateQuantityMutation();
  const { mutate: removeItem } = useRemoveItemMutation();
  const { mutate: moveToCart, isPending: isMoving } = useMoveToCartMutation();

  // Parse price helper
  const getItemPrice = (priceStr: string) => {
    return parseFloat(priceStr.replace(/[^0-9.]/g, "")) || 0;
  };

  // Delivery Method state
  const [deliveryMethod, setDeliveryMethod] = React.useState<
    "standard" | "express"
  >("standard");

  // Math Calculations
  const subtotal = cartItems.reduce((sum, item) => {
    if (!item.product) return sum;
    const price = getItemPrice(item.product.price);
    return sum + price * item.quantity;
  }, 0);

  const isFreeShipping = subtotal >= 2000;

  // Calculate shipping charges based on selection & goals
  const standardCost = subtotal === 0 ? 0 : isFreeShipping ? 0 : 100;
  const expressCost = subtotal === 0 ? 0 : 250;
  const shippingFee =
    deliveryMethod === "standard" ? standardCost : expressCost;
  const grandTotal = subtotal + shippingFee;

  // Free shipping progress variables (only applicable for standard shipping)
  const remainingForFreeShipping = Math.max(0, 2000 - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / 2000) * 100);

  const handleCheckout = () => {
    router.push(`/checkout?delivery=${deliveryMethod}`);
  };

  // Dynamic AI Guide Note generator
  const getGuidesNote = () => {
    if (cartItems.length === 0) {
      return "A blank canvas for quiet reflections. Select one of our slow-made stoneware incense burners or hand-woven tapestries to begin your collection.";
    }

    const categories = cartItems.map(
      (item) => item.product?.category?.toLowerCase() || "",
    );
    const hasCeramic = categories.some(
      (cat) =>
        cat.includes("pottery") ||
        cat.includes("ceramic") ||
        cat.includes("clay") ||
        cat.includes("matcha"),
    );
    const hasLinen = categories.some(
      (cat) =>
        cat.includes("linen") ||
        cat.includes("textile") ||
        cat.includes("cloth") ||
        cat.includes("fabric"),
    );
    const hasWood = categories.some(
      (cat) =>
        cat.includes("wood") || cat.includes("spoon") || cat.includes("carved"),
    );

    if (hasCeramic && hasLinen) {
      return "These items reflect a deep appreciation for the quiet moments. The Matcha Set pairs perfectly with the linen's raw texture for a truly grounded morning ritual.";
    }
    if (hasCeramic) {
      return "Earth and fire transformed. These handcrafted ceramics bring an organic, textured grace to your home, encouraging you to slow down and savor every sip.";
    }
    if (hasLinen) {
      return "Soft, tactile warmth for intentional living. The natural drape and honest weave of these hand-woven fabrics add a gentle, calming presence to any room.";
    }
    if (hasWood) {
      return "Grown from the earth, shaped by human hands. The rich grains and visible chisel marks in these wood carvings speak of patience, nature, and the passage of time.";
    }

    return "A beautiful gathering of slow-made artifacts. Each unique piece carries the breathing spirit of the artisan who shaped it, crafted to become a treasured heirloom.";
  };

  // 1. Loading Skeleton State
  if (isCartLoading) {
    return (
      <div className="min-h-screen bg-background py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="h-12 w-64 bg-surface-container-high animate-pulse rounded-md" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-8">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex gap-6 p-6 border border-outline-variant/30 rounded-2xl bg-surface-container-low animate-pulse"
                >
                  <div className="w-56 h-72 bg-surface-container-high rounded-xl shrink-0" />
                  <div className="flex-1 space-y-4 py-2">
                    <div className="h-6 bg-surface-container-high rounded w-3/4" />
                    <div className="h-4 bg-surface-container-high rounded w-1/4" />
                    <div className="h-16 bg-surface-container-high rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-4 h-[350px] bg-surface-container-high animate-pulse rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 md:py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <main className="max-w-7xl mx-auto">
        {/* Page Title */}
        <h1 className="font-serif text-3xl md:text-[48px] font-normal tracking-wide text-primary mb-12 italic">
          Your Selection
        </h1>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Cart Items & Saved for Later */}
          <div
            className={`${cartItems.length > 0 ? "lg:col-span-8" : "lg:col-span-12"} space-y-12`}
          >
            {cartItems.length === 0 ? (
              /* Empty Bag View */
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 px-6 border border-dashed border-outline-variant/50 rounded-3xl bg-surface-container-lowest max-w-xl mx-auto text-center"
              >
                <div className="bg-primary/5 p-5 rounded-full text-primary mb-6 animate-[pulse_3s_infinite]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="font-serif italic text-lg md:text-xl text-on-surface-variant/80 mb-2">
                  &ldquo;Your bag awaits slow creations.&rdquo;
                </p>
                <p className="font-sans text-xs md:text-sm text-on-surface-variant/60 mb-8 max-w-sm leading-relaxed">
                  Explore our curation of heritage pottery, organic textiles,
                  and hand-carved wood to begin building your custom collection.
                </p>
                <Link
                  href="/explore"
                  className="bg-primary text-white py-3.5 px-8 rounded-full font-sans text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary/90 transition-all shadow-md active:scale-[0.98]"
                >
                  Explore slow-made objects
                </Link>
              </motion.div>
            ) : (
              /* Populated Cart list */
              <div className="space-y-12">
                <AnimatePresence initial={false}>
                  {cartItems.map((item) => {
                    if (!item.product) return null;

                    const price = getItemPrice(item.product.price);
                    const imageUrl =
                      item.product.images[0]?.url || "/placeholder.jpg";
                    const shopName =
                      item.product.shop?.name || "Artisan Workshop";

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        className="flex flex-col md:flex-row gap-8 pb-12 border-b border-outline-variant/30"
                      >
                        {/* Image Container */}
                        <div className="w-full md:w-56 h-72 shrink-0 overflow-hidden bg-surface-container-low rounded-2xl relative">
                          <Image
                            src={imageUrl}
                            alt={item.product.title || "Product"}
                            fill
                            className="object-cover transition-transform duration-700 hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 224px"
                          />
                        </div>

                        {/* Details content */}
                        <div className="flex flex-col justify-between flex-grow">
                          <div>
                            <div className="flex justify-between items-start gap-4">
                              <h2 className="font-serif text-xl md:text-2xl text-primary leading-tight hover:text-primary/80 transition-colors">
                                <Link href={`/products/${item.productId}`}>
                                  {item.product.title}
                                </Link>
                              </h2>
                              <span className="font-serif text-lg md:text-xl text-primary font-medium shrink-0">
                                ₹{price.toLocaleString("en-IN")}
                              </span>
                            </div>
                            <p className="text-secondary font-sans text-[10px] md:text-[11px] font-semibold uppercase tracking-widest mt-2 mb-4 italic">
                              by {shopName}
                            </p>
                            <p className="text-on-surface-variant font-sans text-xs md:text-sm max-w-lg leading-relaxed line-clamp-3">
                              {item.product.description ||
                                "A beautifully crafted artisan object tailored with pure natural materials, reflecting ages of slow-living heritage."}
                            </p>
                          </div>

                          {/* Action controls row */}
                          <div className="flex items-center justify-between mt-8">
                            {/* Quantity bar */}
                            <div className="flex items-center gap-4 border-b border-outline-variant/60 pb-1.5 px-1">
                              <button
                                onClick={() =>
                                  updateQuantity({
                                    itemId: item.id,
                                    quantity: item.quantity - 1,
                                  })
                                }
                                className="text-on-surface-variant hover:text-primary active:scale-95 transition-all cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="font-sans font-semibold text-sm text-primary w-8 text-center select-none">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity({
                                    itemId: item.id,
                                    quantity: item.quantity + 1,
                                  })
                                }
                                className="text-on-surface-variant hover:text-primary active:scale-95 transition-all cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Remove button */}
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-on-surface-variant hover:text-danger-fixed transition-colors flex items-center gap-2 font-sans text-[10px] uppercase tracking-widest cursor-pointer font-bold"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          {cartItems.length > 0 && (
            <aside className="lg:col-span-4 lg:sticky lg:top-24">
              <div className="bg-surface-container-high p-8 flex flex-col gap-8 rounded-3xl shadow-sm border border-outline-variant/20">
                <h3 className="font-serif text-xl md:text-2xl text-primary italic font-normal">
                  Order Summary
                </h3>

                {/* Free Shipping Goal Indicator */}
                <div className="space-y-2 pb-2">
                  <div className="flex justify-between font-sans text-xs text-on-surface-variant font-medium">
                    <span>
                      {isFreeShipping
                        ? "🎉 Free shipping unlocked!"
                        : `Add ₹${remainingForFreeShipping.toLocaleString("en-IN")} more for FREE Delivery`}
                    </span>
                    <span className="text-[10px] font-bold text-secondary">
                      Goal: ₹2,000
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${freeShippingProgress}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full bg-secondary rounded-full"
                    />
                  </div>
                </div>

                {/* Delivery Method Selector */}
                <div className="space-y-4 pb-2 border-b border-outline-variant/20">
                  <h4 className="font-sans text-[10px] uppercase tracking-widest font-bold text-on-surface-variant/80">
                    Delivery Method
                  </h4>
                  <div className="flex flex-col gap-4">
                    {/* Standard Ground Option */}
                    <div
                      onClick={() => setDeliveryMethod("standard")}
                      className={`border p-6 rounded-2xl cursor-pointer transition-all group relative ${
                        deliveryMethod === "standard"
                          ? "border-secondary bg-secondary-fixed/5 shadow-sm"
                          : "border-outline-variant hover:border-secondary bg-white/40"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2 pr-6">
                        <span className={`font-bold font-sans text-xs ${
                          deliveryMethod === "standard" ? "text-primary" : "text-on-surface-variant"
                        }`}>
                          Standard Ground
                        </span>
                        <span className="text-secondary font-sans text-xs font-semibold select-none">
                          {isFreeShipping ? "FREE" : "₹100"}
                        </span>
                      </div>
                      <p className="text-on-surface-variant/70 font-sans text-xs">
                        4–7 business days. Carbon-neutral transit.
                      </p>
                      {deliveryMethod === "standard" ? (
                        <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-secondary flex items-center justify-center shadow-sm">
                          <Check className="w-3 h-3 text-white stroke-[3.5]" />
                        </div>
                      ) : (
                        <div className="absolute top-4 right-4 w-5 h-5 rounded-full border border-outline-variant/50 bg-transparent" />
                      )}
                    </div>

                    {/* Express Air Option */}
                    <div
                      onClick={() => setDeliveryMethod("express")}
                      className={`border p-6 rounded-2xl cursor-pointer transition-all group relative ${
                        deliveryMethod === "express"
                          ? "border-secondary bg-secondary-fixed/5 shadow-sm"
                          : "border-outline-variant hover:border-secondary bg-white/40"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2 pr-6">
                        <span className={`font-bold font-sans text-xs ${
                          deliveryMethod === "express" ? "text-primary" : "text-on-surface-variant"
                        }`}>
                          Express Air
                        </span>
                        <span className="text-secondary font-sans text-xs font-semibold select-none">
                          ₹250
                        </span>
                      </div>
                      <p className="text-on-surface-variant/70 font-sans text-xs">
                        1–2 business days. Next-day dispatch.
                      </p>
                      {deliveryMethod === "express" ? (
                        <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-secondary flex items-center justify-center shadow-sm">
                          <Check className="w-3 h-3 text-white stroke-[3.5]" />
                        </div>
                      ) : (
                        <div className="absolute top-4 right-4 w-5 h-5 rounded-full border border-outline-variant/50 bg-transparent" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Pricing Breakdowns */}
                <div className="space-y-4 font-sans text-sm text-on-surface-variant border-b border-outline-variant/20 pb-5">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-primary">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      Shipping (
                      {deliveryMethod === "standard" ? "Standard" : "Express"})
                    </span>
                    <span className="font-semibold text-primary">
                      {deliveryMethod === "standard" && isFreeShipping ? (
                        <span className="text-secondary font-bold">FREE</span>
                      ) : (
                        `₹${shippingFee}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes</span>
                    <span className="font-semibold text-primary">₹0.00</span>
                  </div>
                  <div className="pt-4 border-t border-outline-variant/40 flex justify-between font-serif text-lg text-primary">
                    <span>Total</span>
                    <span className="font-sans font-bold text-xl text-secondary">
                      ₹{grandTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* CTA Action Panel */}
                <div className="space-y-4">
                  <button
                    disabled={cartItems.length === 0}
                    onClick={handleCheckout}
                    className="w-full bg-primary text-white py-4 px-6 font-sans text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary/95 transition-all duration-300 rounded-full flex items-center justify-center gap-2 group cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Continue to Checkout</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                  <p className="text-center text-[10px] text-on-surface-variant/70 font-sans uppercase tracking-widest font-semibold">
                    Secure payment &amp; carbon-neutral shipping
                  </p>
                </div>

                {/* AI Guide Hint - "The Guide's Note" */}
                <div className="mt-2 p-6 bg-white/40 border border-secondary-container/30 rounded-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-secondary-fixed/5 blur-xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3 text-secondary">
                      <Sparkles className="w-4 h-4" />
                      <span className="font-sans text-[10px] uppercase tracking-widest font-bold">
                        The Guide&apos;s Note
                      </span>
                    </div>
                    <p className="font-serif italic text-secondary text-sm leading-relaxed">
                      &ldquo;{getGuidesNote()}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>

        {/* Saved for Later Section */}
        {favorites.length > 0 && (
          <section className="pt-24 mb-16">
            <div className="flex items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4 flex-grow">
                <h3 className="font-serif text-xl md:text-2xl text-primary font-normal">
                  Saved for Later ({favorites.length})
                </h3>
                <div className="h-[1px] flex-grow bg-outline-variant/30"></div>
              </div>
              {favorites.length > 4 && (
                <Link
                  href="/favorites"
                  className="shrink-0 text-primary font-sans text-xs uppercase tracking-[0.2em] font-bold border-b border-primary/20 hover:border-primary transition-all pb-0.5"
                >
                  View All
                </Link>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {favorites.slice(0, 4).map((p) => {
                const price = getItemPrice(p.price);
                const imageUrl = p.images[0]?.url || "/placeholder.jpg";

                return (
                  <div
                    key={p.id}
                    className="group cursor-pointer flex flex-col"
                  >
                    <div className="aspect-square bg-surface-container overflow-hidden mb-4 rounded-2xl relative">
                      <Image
                        src={imageUrl}
                        alt={p.title || "Stone Burner"}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                    <h4 className="font-serif text-base text-primary leading-tight truncate">
                      <Link href={`/products/${p.id}`}>{p.title}</Link>
                    </h4>
                    <p className="text-secondary font-sans text-xs font-semibold mt-1">
                      ₹{price.toLocaleString("en-IN")}
                    </p>
                    <div>
                      <button
                        disabled={isMoving}
                        onClick={() => moveToCart(p.id)}
                        className="mt-3 text-primary font-sans text-[10px] uppercase font-bold border-b border-primary/20 hover:border-primary transition-all pb-0.5 cursor-pointer disabled:opacity-50 inline-block"
                      >
                        {isMoving ? "Moving..." : "Move to Cart"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

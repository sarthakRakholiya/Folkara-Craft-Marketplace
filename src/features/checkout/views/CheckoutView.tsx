"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, CheckoutSchema } from "../schemas/checkoutSchema";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { COUNTRY_OPTIONS } from "@/features/onboarding/constants/onboarding.constants";
import {
  useCartQuery,
  useClearCartMutation,
} from "@/features/cart/hooks/useCart";
import { toast } from "sonner";
import {
  Sparkles,
  Check,
  CreditCard,
  Lock,
  ShieldCheck,
  Leaf,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

export function CheckoutView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryDelivery = searchParams.get("delivery");
  const initialDelivery = queryDelivery === "express" ? "express" : "standard";

  const { data: cartItems = [], isLoading: isCartLoading } = useCartQuery();
  const clearCartMutation = useClearCartMutation();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [paymentMethod, setPaymentMethod] = useState<"creditCard" | "applePay">(
    "creditCard",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to parse price string or number format cleanly
  const getItemPrice = (priceVal: string | number | null | undefined) => {
    if (priceVal === null || priceVal === undefined) return 0;
    if (typeof priceVal === "number") return priceVal;
    return parseFloat(priceVal.replace(/[^0-9.]/g, "")) || 0;
  };

  // Set up React Hook Form
  const form = useForm<CheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      deliveryMethod: initialDelivery,
      paymentMethod: "creditCard",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });

  const { handleSubmit, control, watch, setValue } = form;

  // Sync deliveryMethod state value for totals math
  const deliveryMethod = watch("deliveryMethod");

  // Math calculations
  const subtotal = cartItems.reduce((sum, item) => {
    if (!item.product) return sum;
    return sum + getItemPrice(item.product.price) * item.quantity;
  }, 0);

  const isFreeShipping = subtotal >= 2000;

  // Dynamic Shipping Charge calculation
  const standardCost = subtotal === 0 ? 0 : isFreeShipping ? 0 : 100;
  const expressCost = subtotal === 0 ? 0 : 250;
  const shippingFee =
    deliveryMethod === "standard" ? standardCost : expressCost;

  // Estimated Tax: 8%
  const tax = subtotal * 0.08;
  const grandTotal = subtotal + shippingFee + tax;

  // Sync React Hook Form paymentMethod hidden field value
  useEffect(() => {
    setValue("paymentMethod", paymentMethod);
  }, [paymentMethod, setValue]);

  // Set initial delivery choice if updated via search param
  useEffect(() => {
    if (queryDelivery === "express" || queryDelivery === "standard") {
      setValue("deliveryMethod", queryDelivery);
    }
  }, [queryDelivery, setValue]);

  // AI Guide's note dynamic content
  const getGuidesNote = () => {
    if (cartItems.length === 0) {
      return "Your basket is ready to be filled with the intentional creations of our slow-living workshop makers.";
    }

    const hasPottery = cartItems.some((item) => {
      const title = item.product?.title?.toLowerCase() || "";
      return (
        title.includes("ceramic") ||
        title.includes("clay") ||
        title.includes("stone")
      );
    });

    const hasLinen = cartItems.some((item) => {
      const title = item.product?.title?.toLowerCase() || "";
      return (
        title.includes("linen") ||
        title.includes("cloth") ||
        title.includes("tapestry")
      );
    });

    if (hasPottery && hasLinen) {
      return "These items reflect a deep appreciation for the quiet moments. The hand-thrown stoneware pairs perfectly with the linen's raw texture for a truly grounded morning ritual.";
    }
    if (hasPottery) {
      return "A quiet morning begins with a beautiful setting. We’ve noticed you’ve selected our hand-thrown ceramics; these will be wrapped in recycled material for a safe, sustainable journey.";
    }
    if (hasLinen) {
      return "Intentional fabrics create an inviting landscape. Your hand-woven linen goods are selected from natural fiber lots and will arrive ready to bring warmth into your home.";
    }
    return "A curated collection of quiet craft. Every piece is handled with extreme intentionality, gently packed, and dispatched straight from the artisan's studio.";
  };

  const onSubmitForm = async (values: CheckoutSchema) => {
    if (cartItems.length === 0) {
      toast.error("Your shopping bag is empty");
      return;
    }
    setIsSubmitting(true);
    try {
      // Simulate secure order dispatch
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clear shopping bag locally and in the database
      await clearCartMutation.mutateAsync();

      toast.success("Order Placed Successfully!", {
        description: `Your quiet, slow-made goods are officially on their way to ${values.firstName}!`,
      });

      // Navigate home
      router.push("/");
    } catch (err) {
      console.error(err);
      toast.error("Failed to place your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCartLoading || !isMounted) {
    return (
      <div className="w-full max-w-[1140px] mx-auto px-12 py-24 flex flex-col items-center justify-center min-h-[500px]">
        <div className="w-12 h-12 rounded-full border-2 border-outline-variant border-t-secondary animate-spin mb-4" />
        <p className="font-serif italic text-on-surface-variant/80 text-sm">
          Preparing your checkout landscape...
        </p>
      </div>
    );
  }

  return (
    <main className="w-full max-w-[1140px] mx-auto px-12 pt-24 py-24">
      {/* Back to Cart Action */}
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 mb-6 text-[10px] tracking-widest font-bold font-sans text-on-surface-variant/60 hover:text-primary uppercase group transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
        <span>Back to Cart</span>
      </Link>

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-3 mb-12 text-[10px] tracking-widest font-bold font-sans text-on-surface-variant/60 uppercase">
        <Link
          href="/cart"
          className="hover:text-primary transition-colors cursor-pointer"
        >
          Cart
        </Link>
        <ChevronRight className="w-3 h-3 text-on-surface-variant/40" />
        <span className="text-primary font-bold">Checkout</span>
        <ChevronRight className="w-3 h-3 text-on-surface-variant/40" />
        <span className="text-on-surface-variant/40 select-none">
          Confirmation
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Form Details */}
        <div className="lg:col-span-7 space-y-8">
          {/* AI Guide Suggestion (Tactile Element) */}
          <div className="bg-white  p-6 rounded-2xl border border-secondary flex gap-4 items-start relative overflow-hidden">
            <div className="absolute inset-0 bg-secondary-fixed/5 blur-xl"></div>
            <Sparkles className="w-5 h-5 text-secondary flex-shrink-0 relative z-10" />
            <div className="relative z-10">
              <p className="font-serif italic text-secondary text-sm leading-relaxed">
                &ldquo;{getGuidesNote()}&rdquo;
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-8">
            {/* Shipping Details */}
            <section className="bg-white/40 border border-outline-variant/30 p-8 rounded-2xl shadow-sm space-y-6">
              <h2 className="font-serif text-xl md:text-2xl text-primary font-normal">
                Shipping Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <FormInput
                    control={control}
                    name="email"
                    label="Email Address"
                    placeholder="email@example.com"
                    type="email"
                    variant="default"
                  />
                </div>
                <div>
                  <FormInput
                    control={control}
                    name="firstName"
                    label="First Name"
                    placeholder="Julian"
                    variant="default"
                  />
                </div>
                <div>
                  <FormInput
                    control={control}
                    name="lastName"
                    label="Last Name"
                    placeholder="Vance"
                    variant="default"
                  />
                </div>
                <div className="md:col-span-2">
                  <FormInput
                    control={control}
                    name="address"
                    label="Shipping Address"
                    placeholder="123 Artisan Way"
                    variant="default"
                  />
                </div>
                <div>
                  <FormInput
                    control={control}
                    name="city"
                    label="City"
                    placeholder="Portland"
                    variant="default"
                  />
                </div>
                <div>
                  <FormInput
                    control={control}
                    name="state"
                    label="State/Province"
                    placeholder="Oregon"
                    variant="default"
                  />
                </div>
                <div>
                  <FormSelect
                    control={control}
                    name="country"
                    label="Country"
                    placeholder="Select Country"
                    options={COUNTRY_OPTIONS}
                    variant="default"
                  />
                </div>
                <div>
                  <FormInput
                    control={control}
                    name="postalCode"
                    label="Postal Code"
                    placeholder="97201"
                    variant="default"
                  />
                </div>
              </div>
            </section>

            {/* Delivery Method */}
            <section className="bg-white/40 border border-outline-variant/30 p-8 rounded-2xl shadow-sm space-y-6">
              <h2 className="font-serif text-xl md:text-2xl text-primary font-normal">
                Delivery Method
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Standard Ground Card */}
                <div
                  onClick={() => setValue("deliveryMethod", "standard")}
                  className={`border p-6 rounded-2xl cursor-pointer transition-all group relative ${
                    deliveryMethod === "standard"
                      ? "border-secondary bg-secondary-fixed/5 shadow-sm"
                      : "border-outline-variant hover:border-secondary bg-white/40"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2 pr-6">
                    <span
                      className={`font-bold font-sans text-xs ${
                        deliveryMethod === "standard"
                          ? "text-primary"
                          : "text-on-surface-variant"
                      }`}
                    >
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

                {/* Express Air Card */}
                <div
                  onClick={() => setValue("deliveryMethod", "express")}
                  className={`border p-6 rounded-2xl cursor-pointer transition-all group relative ${
                    deliveryMethod === "express"
                      ? "border-secondary bg-secondary-fixed/5 shadow-sm"
                      : "border-outline-variant hover:border-secondary bg-white/40"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2 pr-6">
                    <span
                      className={`font-bold font-sans text-xs ${
                        deliveryMethod === "express"
                          ? "text-primary"
                          : "text-on-surface-variant"
                      }`}
                    >
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
            </section>

            {/* Payment Information */}
            <section className="bg-white/40 border border-outline-variant/30 p-8 rounded-2xl shadow-sm space-y-6">
              <h2 className="font-serif text-xl md:text-2xl text-primary font-normal">
                Payment Information
              </h2>

              {/* Payment Method Selector Tabs */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("creditCard")}
                  className={`flex-1 py-4 border rounded-xl flex items-center justify-center gap-2 transition-all font-sans text-xs font-bold uppercase tracking-widest cursor-pointer ${
                    paymentMethod === "creditCard"
                      ? "border-secondary bg-secondary-fixed/10 text-primary"
                      : "border-outline-variant bg-transparent text-on-surface-variant hover:border-secondary"
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-secondary" />
                  <span>Credit Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("applePay")}
                  className={`flex-1 py-4 border rounded-xl flex items-center justify-center gap-2 transition-all font-sans text-xs font-bold uppercase tracking-widest cursor-pointer ${
                    paymentMethod === "applePay"
                      ? "border-secondary bg-secondary-fixed/10 text-primary"
                      : "border-outline-variant bg-transparent text-on-surface-variant hover:border-secondary"
                  }`}
                >
                  <span className="font-bold"></span>
                  <span>Apple Pay</span>
                </button>
              </div>

              {/* Conditional Inputs Block */}
              {paymentMethod === "creditCard" ? (
                <div className="space-y-6 pt-4">
                  <FormInput
                    control={control}
                    name="cardNumber"
                    label="Card Number"
                    placeholder="0000 0000 0000 0000"
                    variant="default"
                  />
                  <div className="grid grid-cols-2 gap-6">
                    <FormInput
                      control={control}
                      name="expiryDate"
                      label="Expiry Date"
                      placeholder="MM / YY"
                      variant="default"
                    />
                    <FormInput
                      control={control}
                      name="cvv"
                      label="CVV"
                      placeholder="123"
                      type="password"
                      variant="default"
                    />
                  </div>
                </div>
              ) : (
                <div className="pt-6 pb-2 text-center bg-secondary-fixed/5 rounded-2xl border border-secondary-container/20 p-6">
                  <p className="font-serif italic text-secondary text-sm">
                    Apple Pay selected. Secure authorization will open after
                    clicking complete.
                  </p>
                </div>
              )}
            </section>
          </form>
        </div>

        {/* Right Side: Order Summary (Sticky) */}
        <aside className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div className="bg-surface-container-high rounded-2xl p-8 shadow-sm space-y-6">
            <h3 className="font-serif text-xl md:text-2xl text-primary font-normal">
              Order Summary
            </h3>

            {/* Product List */}
            {cartItems.length > 0 ? (
              <div className="space-y-6 pb-6 border-b border-outline-variant/30 max-h-[350px] overflow-y-auto pr-2">
                {cartItems.map((item) => {
                  if (!item.product) return null;

                  const title = item.product.title || "Untitled Piece";
                  const imageUrl =
                    item.product.images?.[0]?.url || "/placeholder.jpg";
                  const price = getItemPrice(item.product.price);

                  return (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-20 bg-surface-dim rounded-lg overflow-hidden flex-shrink-0 relative">
                        <Image
                          alt={title}
                          className="object-cover"
                          src={imageUrl}
                          fill
                          sizes="64px"
                        />
                      </div>
                      <div className="flex flex-col justify-center flex-grow">
                        <h4 className="font-bold text-primary font-sans text-xs">
                          {title}
                        </h4>
                        <p className="text-on-surface-variant/70 font-sans text-[10px]">
                          Qty: {item.quantity}
                        </p>
                        <p className="mt-1 font-bold text-secondary font-sans text-xs">
                          ₹{(price * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="font-serif italic text-on-surface-variant/60 text-sm">
                  No items selected yet.
                </p>
              </div>
            )}

            {/* Subtotals & Grand Totals */}
            <div className="space-y-4 font-sans text-xs font-semibold text-on-surface-variant pb-6 border-b border-outline-variant/30">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-primary">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>
                  Shipping (
                  {deliveryMethod === "standard" ? "Standard" : "Express"})
                </span>
                <span className="font-bold text-primary">
                  {deliveryMethod === "standard" && isFreeShipping ? (
                    <span className="text-secondary font-bold">FREE</span>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax (Estimated 8%)</span>
                <span className="font-bold text-primary">
                  ₹{tax.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-end pt-2">
              <span className="font-serif text-lg text-primary">Total</span>
              <span className="font-sans font-bold text-xl text-secondary">
                ₹
                {grandTotal.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            <button
              disabled={isSubmitting || cartItems.length === 0}
              onClick={handleSubmit(onSubmitForm)}
              className="w-full bg-primary text-white py-5 rounded-full font-sans text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary/95 transition-all shadow-md shadow-primary/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Complete Purchase</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

            <p className="text-center text-on-surface-variant/60 text-[10px] uppercase tracking-wider font-sans font-semibold">
              By clicking complete, you agree to our{" "}
              <a
                className="underline hover:text-primary transition-colors cursor-pointer"
                href="#"
              >
                Terms of Service
              </a>
              .
            </p>
          </div>

          {/* Reassurance Row */}
          <div className="flex flex-col gap-4 px-4">
            <div className="flex items-center gap-3 text-on-surface-variant/80">
              <ShieldCheck className="w-5 h-5 text-secondary flex-shrink-0" />
              <span className="font-sans text-[10px] uppercase font-bold tracking-widest">
                Secure encrypted checkout
              </span>
            </div>
            <div className="flex items-center gap-3 text-on-surface-variant/80">
              <Lock className="w-5 h-5 text-secondary flex-shrink-0" />
              <span className="font-sans text-[10px] uppercase font-bold tracking-widest">
                256-bit SSL Data protection
              </span>
            </div>
            <div className="flex items-center gap-3 text-on-surface-variant/80">
              <Leaf className="w-5 h-5 text-secondary flex-shrink-0" />
              <span className="font-sans text-[10px] uppercase font-bold tracking-widest">
                Artisan protected marketplace
              </span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

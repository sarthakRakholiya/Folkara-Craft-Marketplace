"use client";

import React, { useState } from "react";
import { ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createCheckoutSessionAction } from "@/features/checkout/actions/checkout.actions";
import { cn } from "@/lib/utils";

interface CartSummaryCardProps {
  items: Array<{
    productId: string;
    title: string;
    quantity: number;
    pricePerItem: number;
    totalPrice: number;
  }>;
  calculations: {
    subtotal: number;
    gstTax18: number;
    totalAmount: number;
  };
}

export const CartSummaryCard = ({ items, calculations }: CartSummaryCardProps) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsCheckingOut(true);
      const res = await createCheckoutSessionAction();
      if (!res.success || !res.url) {
        toast.error(res.error || "Failed to initiate checkout");
        return;
      }
      window.location.href = res.url;
    } catch (err) {
      toast.error("An unexpected error occurred during checkout");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="bg-surface-container border border-outline-variant/15 rounded-2xl p-4 md:p-5 w-full flex flex-col gap-4 shadow-sm">
      <div className="flex items-center gap-2 text-primary pb-3 border-b border-outline-variant/20">
        <ShoppingBag className="w-4 h-4" />
        <h4 className="font-serif text-[14px] font-semibold leading-none">Your Shopping Bag</h4>
      </div>

      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={`${item.productId}-${idx}`} className="flex justify-between items-start gap-3">
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-sans text-[12px] text-primary truncate leading-tight">
                {item.title}
              </span>
              <span className="font-sans text-[10px] text-on-surface-variant/70 italic mt-0.5">
                Qty: {item.quantity} × ₹{item.pricePerItem.toLocaleString("en-IN")}
              </span>
            </div>
            <span className="font-sans text-[12px] font-semibold text-primary shrink-0">
              ₹{item.totalPrice.toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-1.5 pt-3 border-t border-outline-variant/20 font-sans text-[11px] text-on-surface-variant/80">
        <div className="flex justify-between items-center">
          <span>Subtotal</span>
          <span>₹{calculations.subtotal.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>GST (18%)</span>
          <span>₹{calculations.gstTax18.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-outline-variant/40">
        <span className="font-serif text-[14px] text-primary font-semibold">Total</span>
        <span className="font-sans text-[15px] font-bold text-secondary">
          ₹{calculations.totalAmount.toLocaleString("en-IN")}
        </span>
      </div>

      <button
        onClick={handleCheckout}
        disabled={isCheckingOut}
        className={cn(
          "w-full bg-primary text-white py-2.5 px-4 font-sans text-[11px] font-bold tracking-[0.1em] uppercase hover:bg-primary/95 transition-all duration-300 rounded-full flex items-center justify-center gap-2 group cursor-pointer shadow-sm mt-1",
          isCheckingOut && "opacity-70 cursor-not-allowed"
        )}
      >
        {isCheckingOut ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Initiating Checkout...</span>
          </>
        ) : (
          <>
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
    </div>
  );
};

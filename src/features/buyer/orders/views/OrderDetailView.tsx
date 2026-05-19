"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  Sparkles, 
  AlertCircle, 
  MessageSquare, 
  HelpCircle,
  CheckCircle2,
  Lock,
  ExternalLink,
  Loader2,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useBuyerOrderDetailQuery } from "../hooks/useBuyerOrders";
import { toast } from "sonner";
import { getBuyerOrderInvoiceUrlAction } from "../actions/buyerOrders.actions";
import { generateInvoiceHtml } from "../constants/invoiceTemplate";

export function OrderDetailView({ orderId }: { orderId: string }) {
  const { data: order, isLoading, error } = useBuyerOrderDetailQuery(orderId);
  const [isLiveViewOpen, setIsLiveViewOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleInvoiceDownload = async () => {
    if (!order) return;
    setIsDownloading(true);
    try {
      const res = await getBuyerOrderInvoiceUrlAction(orderId);
      if (res.success) {
        if (res.url) {
          window.open(res.url, "_blank");
          toast.success("Stripe receipt retrieved successfully!");
        } else {
          // Open custom printable receipt falling back elegantly
          const printWindow = window.open("", "_blank", "width=800,height=900");
          if (!printWindow) {
            toast.error("Failed to open print window. Please allow popups.");
            return;
          }

          const oId = order.orderId || orderId;
          const formattedOrderId = oId.startsWith("ord_") 
            ? oId.slice(4).toUpperCase() 
            : oId.slice(-8).toUpperCase();
          const shippingCost = order.shippingCost || 150.00;
          const grandTotal = order.grandTotal || (order.price + shippingCost);

          printWindow.document.write(
            generateInvoiceHtml({
              formattedOrderId,
              orderDate: order.orderDate,
              title: order.title || "Custom Commission",
              artisan: order.artisan,
              price: order.price,
              shippingCost,
              grandTotal,
              shippingName: order.shippingName,
              shippingAddress: order.shippingAddress,
            })
          );
          printWindow.document.close();
          setTimeout(() => {
            printWindow.print();
          }, 350);
          toast.success("Printable invoice generated successfully!");
        }
      } else {
        toast.error(res.error || "Failed to download invoice");
      }
    } catch (err: any) {
      toast.error("Failed to download invoice: " + (err.message || err));
    } finally {
      setIsDownloading(false);
    }
  };

  // Format currency in Indian Rupees
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    });
  };

  // 1. LOADING STATE
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-margin-page py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="font-label-caps text-label-caps text-outline animate-pulse">
          Retrieving Artisan Order Details...
        </p>
      </div>
    );
  }

  // 2. ERROR / NOT FOUND STATE
  if (error || !order) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-6">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h4 className="font-serif text-lg text-slate-800 font-semibold font-notoSerif">Order Details Missing</h4>
          <p className="text-slate-500 text-xs leading-relaxed">
            The order item requested is not found or you are not authorized to track it.
          </p>
        </div>
        <Link
          href="/buyer/orders"
          className="inline-flex bg-slate-900 text-white hover:bg-slate-800 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-colors items-center gap-2"
        >
          <ArrowLeft size={14} />
          <span>Back to Purchases</span>
        </Link>
      </div>
    );
  }

  // Helper to determine step states
  const getStepState = (index: number) => {
    if (order.rawStatus === "CANCELLED") {
      return "cancelled";
    }

    let activeIndex = 0;
    if (order.rawStatus === "PENDING") {
      activeIndex = 0;
    } else if (order.rawStatus === "IN_PROGRESS") {
      activeIndex = 1;
    } else if (order.rawStatus === "SHIPPED") {
      activeIndex = 3; // In Transit
    } else if (order.rawStatus === "DELIVERED") {
      activeIndex = 5; // All steps completed, including "Delivered"
    }

    if (index < activeIndex) {
      return "completed";
    } else if (index === activeIndex) {
      return "active";
    } else {
      return "pending";
    }
  };

  const steps = [
    {
      key: "confirmed",
      title: "Order Confirmed",
      date: order.orderDate,
      description: "Your commission is verified and entered into the artisan's workspace.",
    },
    {
      key: "crafting",
      title: "Craft Preparation",
      date: order.rawStatus === "PENDING" ? "Awaiting queue" : order.orderDate,
      description: "The artisan has selected the raw materials and is hand-shaping your piece.",
      showArtisanNote: true,
    },
    {
      key: "ready",
      title: "Ready to Ship",
      date: order.rawStatus === "DELIVERED" || order.rawStatus === "SHIPPED" ? order.orderDate : `Est. ${order.arrivalDate}`,
      description: "Carefully inspected, finished, and padded in plastic-free packaging.",
    },
    {
      key: "transit",
      title: "In Transit",
      date: order.rawStatus === "SHIPPED" || order.rawStatus === "DELIVERED" ? `Via carrier` : "Pending shipment",
      description: "Handed over to carrier partners and traveling to your destination.",
    },
    {
      key: "delivered",
      title: "Delivered",
      date: order.deliveredDate || `Est. arrival: ${order.arrivalDate}`,
      description: "Arrived at your doorstep, ready to enrich your modern home.",
    },
  ];

  // Dynamic Header Copy based on Status
  const getHeaderCopy = () => {
    if (order.rawStatus === "CANCELLED") {
      return {
        title: "Order Cancelled",
        subtitle: "This order has been cancelled and a full refund has been issued."
      };
    }
    if (order.rawStatus === "DELIVERED") {
      return {
        title: "Your crafted piece has arrived",
        subtitle: "Unboxed and ready to bring slow-made warmth to your home. We hope it inspires you daily."
      };
    }
    if (order.rawStatus === "SHIPPED") {
      return {
        title: "Your crafted piece is in transit",
        subtitle: "It has left the artisan's bench and is traveling safely to your doorstep."
      };
    }
    if (order.rawStatus === "IN_PROGRESS") {
      return {
        title: "Your custom piece is being shaped",
        subtitle: "The artisan is carefully molding, detailing, and curing your order with patient craftsmanship."
      };
    }
    return {
      title: "Your order is confirmed",
      subtitle: "The artisan has received your commission and is preparing the workshop."
    };
  };

  const headerCopy = getHeaderCopy();

  const handleContactClick = () => {
    toast.success(`Opening conversation with ${order.artisan}...`);
  };

  const handleHelpClick = () => {
    toast.info("Connecting to Folkara support assistant...");
  };

  return (
    <div className="max-w-5xl mx-auto px-margin-page py-16">
      {/* Back to Orders */}
      <Link
        href="/buyer/orders"
        className="flex items-center gap-2 text-outline hover:text-primary transition-colors mb-12 group inline-flex"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-label-caps text-label-caps tracking-widest font-semibold">BACK TO PURCHASES</span>
      </Link>

      {/* Header Section */}
      <section className="text-center mb-16 max-w-2xl mx-auto space-y-4">
        <span className="text-[11px] font-label-caps tracking-[0.25em] text-secondary font-bold uppercase bg-secondary/10 px-4 py-1.5 rounded-full inline-block">
          Order Status
        </span>
        <h2 className="font-headline-md text-3xl md:text-4xl text-primary font-notoSerif mt-2">
          {headerCopy.title}
        </h2>
        <p className="font-body-lg text-on-surface-variant leading-relaxed">
          {headerCopy.subtitle}
        </p>
      </section>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* LEFT COLUMN: Dynamic Order Timeline, Artisan Updates & Live Workshop */}
        <div className="lg:col-span-8 space-y-24">
          
          {/* Order Timeline */}
          <section className="relative pl-4">
            <div className="flex flex-col items-start">
              {steps.map((step, idx) => {
                const state = getStepState(idx);
                const isLast = idx === steps.length - 1;

                return (
                  <div key={step.key} className="flex items-start w-full group relative">
                    {/* Left Node & Connector line */}
                    <div className="flex flex-col items-center w-12 mr-6 shrink-0">
                      {state === "completed" && (
                        <div className="w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-emerald-100 mb-1 relative z-10" />
                      )}
                      
                      {state === "active" && (
                        <div className="w-6 h-6 rounded-full bg-secondary-container active-glow flex items-center justify-center relative z-10 mb-1">
                          <div className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                        </div>
                      )}
                      
                      {state === "pending" && (
                        <div className="w-4 h-4 rounded-full border-2 border-outline-variant bg-surface mb-1 relative z-10" />
                      )}

                      {state === "cancelled" && (
                        <div className="w-4 h-4 rounded-full bg-rose-600 mb-1 relative z-10" />
                      )}

                      {/* Vertical line connecting to next node */}
                      {!isLast && (
                        <div 
                          className={`absolute left-[23px] top-6 bottom-[-24px] w-[2px] transition-colors duration-500 ${
                            state === "completed" ? "bg-emerald-500" : "bg-outline-variant/30"
                          }`} 
                        />
                      )}
                    </div>

                    {/* Step Details */}
                    <div className={`flex-1 pb-10 transition-opacity duration-300 ${
                      state === "pending" ? "opacity-50" : "opacity-100"
                    }`}>
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h3 className="font-headline-sm text-lg md:text-xl font-bold text-primary font-notoSerif">
                          {step.title}
                        </h3>
                        {state === "active" && (
                          <span className="bg-secondary-fixed-dim text-on-secondary-fixed-variant text-[10px] font-label-caps tracking-widest px-3 py-1 rounded-full font-bold">
                            In Progress
                          </span>
                        )}
                      </div>
                      
                      <p className="text-on-surface-variant/80 text-[11px] font-label-caps tracking-wider mb-2">
                        {step.date}
                      </p>
                      <p className="text-on-surface-variant text-sm leading-relaxed max-w-xl">
                        {step.description}
                      </p>

                      {/* Maker Story Quote under Crafting Stage */}
                      {step.showArtisanNote && (state === "active" || state === "completed") && (
                        <motion.div 
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="relative bg-surface-container-low p-6 rounded-2xl border-l-2 border-secondary/20 mt-6 max-w-xl shadow-sm border border-outline-variant/5"
                        >
                          <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full overflow-hidden border-2 border-surface bg-primary text-white flex items-center justify-center font-serif italic text-sm shadow-sm shrink-0 select-none">
                            {order.artisan.slice(0, 2).toUpperCase()}
                          </div>
                          <p className="serif-italic text-on-surface mb-3 text-base leading-relaxed italic opacity-95">
                            &quot;{order.artisanNote}&quot;
                          </p>
                          <span className="text-[10px] font-label-caps tracking-widest text-secondary font-bold">
                            — {order.artisan}, Workshop Maker
                          </span>
                        </motion.div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Dynamic Artisan Updates & Workshop Image */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-outline-variant/10">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Sparkles className="text-secondary w-5 h-5" />
                <h3 className="font-headline-sm text-lg md:text-xl font-bold text-primary font-notoSerif">
                  Artisan Updates
                </h3>
              </div>

              {/* Updates List */}
              <div className="space-y-6">
                {/* Always show raw material update */}
                <div className="flex gap-4 items-start">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative bg-surface-container-high border border-outline-variant/10">
                    <Image
                      src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=150&q=80"
                      alt="Workshop material prep"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-[9px] font-label-caps text-outline tracking-widest uppercase mb-0.5">
                      Stage 1 • Material Selection
                    </p>
                    <p className="text-xs text-on-surface-variant font-medium">
                      Raw earth elements, premium clays, and structural minerals chosen and refined in the studio.
                    </p>
                  </div>
                </div>

                {/* Show forming update if in progress, shipped, or delivered */}
                {(order.rawStatus === "IN_PROGRESS" || order.rawStatus === "SHIPPED" || order.rawStatus === "DELIVERED") && (
                  <div className="flex gap-4 items-start">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative bg-surface-container-high border border-outline-variant/10">
                      <Image
                        src="https://images.unsplash.com/photo-1565192647048-f997ed87f5e2?auto=format&fit=crop&w=150&q=80"
                        alt="Shaping clay bench"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-[9px] font-label-caps text-outline tracking-widest uppercase mb-0.5">
                        Stage 2 • Studio Shaping
                      </p>
                      <p className="text-xs text-on-surface-variant font-medium">
                        The raw silhouette has been thrown and shaped on the potter&apos;s wheel to cure under leather-hard drying states.
                      </p>
                    </div>
                  </div>
                )}

                {/* Show shipped update if shipped or delivered */}
                {(order.rawStatus === "SHIPPED" || order.rawStatus === "DELIVERED") && (
                  <div className="flex gap-4 items-start">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative bg-surface-container-high border border-outline-variant/10">
                      <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] font-label-caps text-outline tracking-widest uppercase mb-0.5">
                        Stage 3 • Quality Dispatched
                      </p>
                      <p className="text-xs text-on-surface-variant font-medium">
                        Item quality inspected, sealed in premium sustainable wood fiber sheets, and picked up by high-care carrier partners.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Workshop Interactive Portrait */}
            <div className="relative group">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-md relative bg-surface-container-low border border-outline-variant/10">
                <Image
                  src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=600&q=80"
                  alt="Artisan workshop view"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Live Stream Glowing Indicator */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10 select-none pointer-events-none">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  <span className="text-[9px] font-label-caps tracking-widest text-white font-bold">
                    WORKSHOP LIVE
                  </span>
                </div>
              </div>
              
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl duration-300">
                <button 
                  onClick={() => setIsLiveViewOpen(true)}
                  className="bg-surface/95 px-6 py-2.5 rounded-full font-label-caps text-[10px] tracking-widest text-primary font-bold cursor-pointer transition-transform hover:scale-105 shadow-md uppercase"
                >
                  View Studio Feed
                </button>
              </div>
            </div>
          </section>

          {/* Delivery Map representation */}
          <section className="rounded-2xl overflow-hidden h-80 relative bg-surface-container-high border border-outline-variant/10 shadow-sm">
            {/* Minimal Map Background */}
            <div className="absolute inset-0 grayscale opacity-45 select-none pointer-events-none">
              <Image 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=900&q=80" 
                alt="Delivery Map Grid"
                fill
                className="object-cover"
              />
            </div>
            
            {/* Amber glowing dot for origin */}
            <div className="absolute top-1/3 left-1/4 flex flex-col items-center">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-secondary"></span>
              </span>
              <p className="bg-black/80 backdrop-blur-md text-[9px] font-label-caps tracking-widest text-white px-2 py-1 rounded mt-2 border border-white/5">
                {order.artisan} Workshop
              </p>
            </div>

            {/* Indigo glowing dot for destination */}
            <div className="absolute bottom-1/4 right-1/3 flex flex-col items-center">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-600"></span>
              </span>
              <p className="bg-black/80 backdrop-blur-md text-[9px] font-label-caps tracking-widest text-white px-2 py-1 rounded mt-2 border border-white/5">
                Destination
              </p>
            </div>

            <div className="absolute bottom-6 left-6 bg-surface/95 p-4 rounded-xl shadow-md border border-outline-variant/20 max-w-[280px]">
              <p className="text-[10px] font-label-caps text-outline mb-1 uppercase tracking-widest">
                SHIPPING DESTINATION
              </p>
              <p className="font-body-md font-bold text-primary text-xs leading-relaxed truncate">
                {order.shippingAddress}
              </p>
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: Order summary, grand total receipt, shipping address, action buttons */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Purchased Item Snapshot */}
          <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/10 shadow-sm space-y-4">
            <p className="font-label-caps text-[10px] text-outline uppercase tracking-widest font-bold">
              COMMISSIONED PIECE
            </p>
            
            <div className="flex gap-4">
              <div className="w-20 h-20 relative rounded-xl overflow-hidden border border-outline-variant/10 shrink-0 bg-surface-container">
                <Image
                  src={order.image}
                  alt={order.title || "Order Piece"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-serif text-slate-800 text-sm md:text-base font-bold truncate font-notoSerif">
                  {order.title}
                </h4>
                <p className="text-secondary font-bold text-sm mt-1">
                  {formatCurrency(order.price)}
                </p>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {order.tags.slice(0, 2).map((t) => (
                    <span key={t} className="text-[8px] font-label-caps tracking-wider bg-surface-container-high px-2 py-0.5 rounded text-primary">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleContactClick}
              className="bg-primary text-white w-full py-4 rounded-xl font-label-caps tracking-widest uppercase hover:bg-primary/95 transition-all flex items-center justify-center gap-2 text-xs font-bold"
            >
              <MessageSquare size={16} />
              Contact Artisan
            </Button>
            <Button
              onClick={handleHelpClick}
              variant="outline"
              className="bg-transparent border border-outline-variant text-primary w-full py-4 rounded-xl font-label-caps tracking-widest uppercase hover:bg-surface-container transition-all flex items-center justify-center gap-2 text-xs font-bold"
            >
              <HelpCircle size={16} />
              Get Support
            </Button>
            <Button
              onClick={handleInvoiceDownload}
              disabled={isDownloading}
              variant="outline"
              className="bg-transparent border border-outline-variant text-primary w-full py-4 rounded-xl font-label-caps tracking-widest uppercase hover:bg-surface-container transition-all flex items-center justify-center gap-2 text-xs font-bold"
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              ) : (
                <Download size={16} />
              )}
              Download Invoice
            </Button>
            
            <p className="text-center text-[10px] font-label-caps text-outline tracking-wider mt-2 font-semibold select-all">
              Order ID: #{orderId.startsWith("ord_") ? orderId : `AD-${orderId.slice(-8).toUpperCase()}`}
            </p>
          </div>

          {/* Shipping Details */}
          <div className="space-y-6 bg-surface-container p-6 rounded-2xl border border-outline-variant/15 shadow-sm">
            <div className="flex gap-3">
              <MapPin size={18} className="text-outline shrink-0 mt-0.5" />
              <div>
                <p className="font-label-caps text-[9px] text-outline mb-1 uppercase tracking-widest font-bold">
                  DELIVERY ADDRESS
                </p>
                <p className="font-sans font-medium text-slate-700 leading-relaxed text-xs">
                  <strong>{order.shippingName}</strong>
                  <br />
                  {order.shippingAddress}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-outline-variant/10 flex gap-3">
              <CreditCard size={18} className="text-outline shrink-0 mt-0.5" />
              <div>
                <p className="font-label-caps text-[9px] text-outline mb-1 uppercase tracking-widest font-bold">
                  PAYMENT SUMMARY
                </p>
                <p className="font-sans text-slate-500 text-xs flex items-center gap-1.5">
                  <Lock size={12} className="text-emerald-600" />
                  <span>Secure Stripe Payment</span>
                </p>
              </div>
            </div>
          </div>

          {/* Full Transaction Receipt Summary */}
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10 space-y-4 shadow-sm">
            <p className="font-label-caps text-[10px] text-outline mb-1 uppercase tracking-widest font-bold">
              ORDER RECEIPT
            </p>
            <div className="flex justify-between text-xs">
              <span className="text-on-surface-variant font-medium">Cart Subtotal</span>
              <span className="text-primary font-bold">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-on-surface-variant font-medium">Shipping & Handling</span>
              <span className="text-primary font-bold">
                {order.shippingCost === 0 ? "FREE" : formatCurrency(order.shippingCost)}
              </span>
            </div>
            <div className="flex justify-between text-xs pb-3 border-b border-outline-variant/10">
              <span className="text-on-surface-variant font-medium">Estimated Taxes</span>
              <span className="text-primary font-bold">₹0.00</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="font-serif font-semibold text-base text-primary font-notoSerif">Grand Total</span>
              <span className="font-sans font-bold text-indigo-600 text-lg">{formatCurrency(order.grandTotal)}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Workshop Feed Dialog / Modal */}
      {isLiveViewOpen && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-2xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
            
            {/* Aspect Video frame */}
            <div className="aspect-video relative bg-black flex items-center justify-center">
              <iframe 
                src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1&loop=1&playlist=jfKfPfyJRdk&controls=0&showinfo=0"
                title="Artisan Live Workshop Feed"
                className="absolute inset-0 w-full h-full border-0 pointer-events-none grayscale opacity-80"
                allow="autoplay; encrypted-media"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/45" />
              
              {/* Overlay HUD info */}
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10 select-none">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                <span className="text-[9px] font-label-caps tracking-widest text-white font-bold">
                  STUDIO LIVE CAMERA 01
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-serif text-lg font-bold text-white font-notoSerif">
                  {order.artisan}&apos;s Studio Bench
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Bathed in morning sunlight, this live workspace feed connects buyers to the pure hand-made processes of their slow-crafted relic. No shortcuts, just patience.
                </p>
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={() => setIsLiveViewOpen(false)}
                  className="bg-white hover:bg-slate-100 text-slate-950 text-xs uppercase font-label-caps tracking-widest font-bold px-6 py-2.5 rounded-lg"
                >
                  Close Studio Feed
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

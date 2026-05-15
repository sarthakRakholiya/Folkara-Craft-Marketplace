"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Package, MapPin, CreditCard, Sparkles } from "lucide-react";
import { OrderItem } from "../types/order";
import { Button } from "@/components/ui/Button";

const MOCK_DETAIL_ORDER: OrderItem = {
  id: "90021",
  title: "Hand-speckled Oatmeal Pasta Bowl",
  price: 84.0,
  image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAc_djh6IBGSwEbiGRCY_TfgWHPe-kPU7aOFbhkZJqkdpuEVw5yx00JH_6hQJj6aJZbtwdurXPL5i4f_IN6q8DMnyggX0sfLObHLTCtuoUWxv4Ot2ofyITp3n9EpnpM1D7BZI2c8GFQe9Ec_lHbEAkQJ99b330FNAM8UesjNueTMf5jWFlyv00ReRwOHnhKIChScZ9Sozi2oYIc2CnTnq_WDkLnv9_G2kkRCVn1GVLrv2LdNwRD0_OLi3mTIIi4AGf2lUtVhKLwOEA",
  tags: ["HAND-THROWN", "LOCAL CLAY", "STUDIO RELEASE #12"],
  artisan: "Elena Moretti",
  orderDate: "Oct 24, 2023",
  arrivalDate: "Oct 30, 2023",
  trackingNumber: "FLK-90021",
  status: "IN_TRANSIT",
};

export function OrderDetailView({ orderId }: { orderId: string }) {
  // In a real app, we would fetch the order by ID
  const order = MOCK_DETAIL_ORDER;

  return (
    <div className="max-w-5xl mx-auto px-margin-page py-16">
      <Link
        href="/buyer/orders"
        className="flex items-center gap-2 text-outline hover:text-primary transition-colors mb-12 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-label-caps text-label-caps">BACK TO ORDERS</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Column: Image & Main Info */}
        <div className="lg:col-span-7">
          <div className="aspect-square bg-surface-container-low rounded-2xl overflow-hidden relative shadow-md mb-12">
            <Image
              src={order.image}
              alt={order.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-12">
            <div>
              <div className="flex justify-between items-start mb-6">
                <h1 className="font-display-lg text-4xl text-primary">
                  {order.title}
                </h1>
                <span className="font-headline-sm text-2xl text-secondary">
                  ${order.price.toFixed(2)}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {order.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-surface-container-high text-primary rounded-full font-label-caps text-[10px] tracking-widest"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Artisan Note */}
            <div className="bg-surface-container-low p-10 rounded-2xl border border-outline-variant/10 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6 text-on-surface-variant">
                <Sparkles size={16} className="text-on-surface-variant/40" />
                <span className="font-label-caps text-[10px] tracking-[0.2em] font-bold uppercase opacity-60">
                  A NOTE FROM THE MAKER
                </span>
              </div>
              <p className="font-headline-sm italic text-on-surface-variant leading-relaxed text-xl mb-8 opacity-90">
                &quot;This particular bowl was fired in the last batch of the
                season. The speckles are unique to the minerals found in our local
                quarry this month. I hope it brings a sense of the Italian coast
                to your table.&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-surface-container-highest/50 flex items-center justify-center font-serif italic text-primary">
                  EM
                </div>
                <div>
                  <p className="font-label-caps text-[10px] text-outline mb-1">
                    ARTISAN
                  </p>
                  <p className="font-body-md font-bold text-primary">
                    {order.artisan}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Status & Details */}
        <div className="lg:col-span-5 space-y-12">
          {/* Order Status */}
          <div className="bg-surface-container p-8 rounded-2xl space-y-8">
            <div>
              <p className="font-label-caps text-[10px] text-outline mb-4 uppercase tracking-widest">
                ORDER STATUS
              </p>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-primary text-white flex items-center justify-center rounded-xl">
                  <Package size={24} />
                </div>
                <div>
                  <h4 className="font-headline-sm text-primary text-xl">
                    {order.status.replace("_", " ")}
                  </h4>
                  <p className="text-on-surface-variant/60 text-sm">
                    {order.status === "IN_TRANSIT"
                      ? "Arriving Oct 30, 2023"
                      : "Delivered Sept 18, 2023"}
                  </p>
                </div>
              </div>
            </div>

            {order.trackingNumber && (
              <div className="pt-8 border-t border-outline-variant/10">
                <p className="font-label-caps text-[10px] text-outline mb-4 uppercase tracking-widest">
                  TRACKING NUMBER
                </p>
                <div className="flex justify-between items-center group cursor-pointer">
                  <p className="font-headline-sm text-primary text-lg underline decoration-primary/20">
                    {order.trackingNumber}
                  </p>
                  <ChevronRight size={18} className="text-outline group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            )}

            <Button
              className="w-full font-label-caps text-[10px] tracking-widest uppercase mb-4"
              size="lg"
            >
              TRACK ON CARRIER SITE
            </Button>
            <Button
              variant="outline"
              className="w-full border-outline-variant/30 font-label-caps text-[10px] tracking-widest uppercase"
              size="lg"
            >
              DOWNLOAD INVOICE
            </Button>
          </div>

          {/* Shipping & Payment */}
          <div className="space-y-8 px-4">
            <div className="flex gap-4">
              <MapPin size={20} className="text-outline shrink-0 mt-1" />
              <div>
                <p className="font-label-caps text-[10px] text-outline mb-2 uppercase tracking-widest">
                  SHIPPING ADDRESS
                </p>
                <p className="font-body-md text-on-surface leading-relaxed">
                  Arthur Dent<br />
                  42 Heart of Gold Way<br />
                  London, UK NW1 6XE
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CreditCard size={20} className="text-outline shrink-0 mt-1" />
              <div>
                <p className="font-label-caps text-[10px] text-outline mb-2 uppercase tracking-widest">
                  PAYMENT METHOD
                </p>
                <p className="font-body-md text-on-surface">
                  Mastercard ending in 1234
                </p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/10 space-y-4">
            <p className="font-label-caps text-[10px] text-outline mb-2 uppercase tracking-widest">
              PRICE BREAKDOWN
            </p>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Subtotal</span>
              <span className="text-primary font-bold">₹{order.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Shipping</span>
              <span className="text-primary font-bold">₹12.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Service Fee</span>
              <span className="text-primary font-bold">₹4.50</span>
            </div>
            <div className="flex justify-between pt-4 border-t border-outline-variant/20">
              <span className="font-headline-sm text-lg text-primary">Total</span>
              <span className="font-headline-sm text-lg text-primary">₹{(order.price + 12 + 4.5).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

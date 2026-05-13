"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { OrderCard } from "../components/OrderCard";
import { OrderItem } from "../types/order";
import { Button } from "@/components/ui/Button";

const MOCK_ORDERS: OrderItem[] = [
  {
    id: "90021",
    title: "Hand-speckled Oatmeal Pasta Bowl",
    price: 84.0,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAc_djh6IBGSwEbiGRCY_TfgWHPe-kPU7aOFbhkZJqkdpuEVw5yx00JH_6hQJj6aJZbtwdurXPL5i4f_IN6q8DMnyggX0sfLObHLTCtuoUWxv4Ot2ofyITp3n9EpnpM1D7BZI2c8GFQe9Ec_lHbEAkQJ99b330FNAM8UesjNueTMf5jWFlyv00ReRwOHnhKIChScZ9Sozi2oYIc2CnTnq_WDkLnv9_G2kkRCVn1GVLrv2LdNwRD0_OLi3mTIIi4AGf2lUtVhKLwOEA",
    tags: ["HAND-THROWN", "LOCAL CLAY", "STUDIO RELEASE #12"],
    artisan: "Elena Moretti",
    orderDate: "Oct 24, 2023",
    arrivalDate: "Oct 30, 2023",
    trackingNumber: "FLK-90021",
    status: "IN_TRANSIT",
  },
  {
    id: "85421",
    title: "Organic Sage Linen Throw",
    price: 142.0,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBYObFg3Nk2-iutZY-4PSrCdbQZauZmD-q_mj66Ps5evK5dqGd7h5-IpikD9Zb4-ZqEPU2zqUFThIkWmnNTFBFH-lS71vQbcYm1GwQXUECPsXVoD7spKtTFDE_FMZaC6MHAoG2g29Pdv_gcABHsKm7COLEVW0JBCz4qaflwvi_F9h8GH1vH3bIUvtIWFE5zCQOblW1N2j06GedtLkIkN8GrtxwOsraEiRWuXFX3TieTt6g0ykZTkIphriIGQZIW8p1pSWSF6F3nZPQ",
    tags: ["VEGAN DYE", "HAND-LOOMED"],
    artisan: "The Weaving Shed",
    orderDate: "Sept 12, 2023",
    deliveredDate: "Sept 18, 2023",
    rating: 5,
    status: "DELIVERED",
  },
  {
    id: "72109",
    title: "Petrichor & Cedar Soy Candle",
    price: 38.0,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCzomgSHanl2avLL4tQvyAByvmh5kZ9kdZKcSUwKCbNFu4sG3BK9ssVd2rf_Va2L41A2NlWtdjCUWV_pQmekBSUDiycj0PdvnC1GHKCA-_oam5A27q6Oxib2H2k73C1R9iu5iK-0o6P-fkCj75jBe0POgb_1Y1LSUszBCT5Gbw6WQWZ2IDMxrvABT3FYUJWo9vEGB5BW5zCcUafdlx4FT3Q6pAo3q10MFflQxPgVl-jQyl_5rIsUcYeMqwKKve9H9kFVbgrTBHyO1k",
    tags: ["SMALL BATCH"],
    artisan: "Lume Apothecary",
    orderDate: "Aug 02, 2023",
    deliveredDate: "Aug 08, 2023",
    status: "DELIVERED",
  },
];

export function OrderListView() {
  return (
    <section className="max-w-5xl mx-auto px-margin-page py-16">
      {/* Order List Header */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-1">
            YOUR PURCHASES
          </h3>
          <p className="font-body-lg text-body-lg text-outline italic">
            Refining the timeline of your curated collection.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            shape="rounded"
            className="font-label-caps text-[10px] tracking-widest"
          >
            ALL TIME
          </Button>
          <Button
            variant="outline"
            size="sm"
            shape="rounded"
            className="border-outline-variant/30 font-label-caps text-[10px] tracking-widest"
          >
            FILTER
          </Button>
        </div>
      </div>

      {/* Vertical Order List */}
      <div className="space-y-12">
        {MOCK_ORDERS.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>

      {/* Load More / Loader */}
      <div className="py-24 flex flex-col items-center">
        <div className="flex gap-1 mb-6">
          <div className="w-1.5 h-1.5 bg-primary/20 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 bg-primary/20 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 bg-primary/20 rounded-full animate-bounce"></div>
        </div>
        <p className="font-label-caps text-[10px] text-outline tracking-[0.4em] uppercase animate-pulse">
          Retrieving More Memories
        </p>
      </div>
    </section>
  );
}

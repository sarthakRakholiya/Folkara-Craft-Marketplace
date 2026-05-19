"use client";

import React from "react";
import { Sparkles, ShoppingBag, ArrowRight } from "lucide-react";
import { OrderCard } from "../components/OrderCard";
import { Button } from "@/components/ui/Button";
import { useBuyerOrdersQuery } from "../hooks/useBuyerOrders";
import Link from "next/link";

export function OrderListView() {
  const { data: orders = [], isLoading, error } = useBuyerOrdersQuery();
  const [currentPage, setCurrentPage] = React.useState(1);
  const ITEMS_PER_PAGE = 2;

  // Calculate pagination details
  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <section className="max-w-5xl mx-auto px-margin-page py-16">
      {/* Order List Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
        <div>
          <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-1">
            YOUR PURCHASES
          </h3>
          <p className="font-body-lg text-body-lg text-outline italic">
            Refining the timeline of your curated collection.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            shape="rounded"
            className="font-label-caps text-[10px] tracking-widest pointer-events-none"
          >
            ALL TIME
          </Button>
        </div>
      </div>

      {/* LOADING SHIMMER STATE */}
      {isLoading && (
        <div className="space-y-12 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-8 pb-12 border-b border-outline-variant/10">
              <div className="w-full md:w-64 h-64 bg-slate-200/60 rounded-lg shrink-0"></div>
              <div className="flex-1 space-y-6 py-2">
                <div className="flex justify-between items-start">
                  <div className="w-2/3 h-6 bg-slate-200/60 rounded"></div>
                  <div className="w-16 h-6 bg-slate-200/60 rounded"></div>
                </div>
                <div className="flex gap-2">
                  <div className="w-20 h-5 bg-slate-200/60 rounded-full"></div>
                  <div className="w-24 h-5 bg-slate-200/60 rounded-full"></div>
                </div>
                <div className="grid grid-cols-2 gap-y-4 max-w-sm pt-4">
                  <div className="space-y-1"><div className="w-12 h-3 bg-slate-200/40 rounded"></div><div className="w-20 h-4 bg-slate-200/60 rounded"></div></div>
                  <div className="space-y-1"><div className="w-16 h-3 bg-slate-200/40 rounded"></div><div className="w-16 h-4 bg-slate-200/60 rounded"></div></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ERROR STATE */}
      {error && !isLoading && (
        <div className="py-16 text-center space-y-4 bg-white border border-outline-variant/20 rounded-2xl p-8 max-w-md mx-auto">
          <p className="text-sm text-rose-500 font-medium">Failed to retrieve order history.</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="mx-auto">
            Try Again
          </Button>
        </div>
      )}

      {/* EMPTY STATE */}
      {!isLoading && !error && orders.length === 0 && (
        <div className="py-24 text-center max-w-md mx-auto space-y-6">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h4 className="font-serif text-lg text-slate-800 font-semibold">No purchases recorded</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              You haven&apos;t added any slow-made, handcrafted relic treasures to your collection yet.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex bg-slate-900 text-white hover:bg-slate-800 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-colors items-center gap-2 group mx-auto"
          >
            <span>Discover Slow-Made Crafts</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      )}

      {/* ACTIVE LIVE LIST */}
      {!isLoading && !error && paginatedOrders.length > 0 && (
        <div className="space-y-12">
          {paginatedOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      {/* CUSTOM PAGINATION COMPONENT */}
      {!isLoading && !error && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-16 pt-8 border-t border-outline-variant/15">
          <button
            onClick={() => {
              setCurrentPage((prev) => Math.max(prev - 1, 1));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-outline-variant/30 hover:border-primary disabled:opacity-30 disabled:pointer-events-none transition-colors text-primary font-bold text-sm"
            aria-label="Previous Page"
          >
            ←
          </button>
          {[...Array(totalPages)].map((_, idx) => {
            const pageNum = idx + 1;
            const isActive = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                onClick={() => {
                  setCurrentPage(pageNum);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`w-10 h-10 rounded-full font-label-caps text-xs tracking-wider font-bold transition-all ${
                  isActive
                    ? "bg-primary text-white scale-105 shadow-sm"
                    : "bg-transparent text-outline hover:text-primary hover:bg-surface-container"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => {
              setCurrentPage((prev) => Math.min(prev + 1, totalPages));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-outline-variant/30 hover:border-primary disabled:opacity-30 disabled:pointer-events-none transition-colors text-primary font-bold text-sm"
            aria-label="Next Page"
          >
            →
          </button>
        </div>
      )}

      {/* End of list indicator */}
      {!isLoading && !error && orders.length > 0 && (
        <div className="py-16 text-center">
          <p className="font-label-caps text-[9px] text-outline/50 tracking-[0.4em] uppercase">
            Curated Collection Synchronized
          </p>
        </div>
      )}
    </section>
  );
}

"use client";

import React, { useState, useEffect, useCallback, useTransition } from "react";
import { Sparkles, ShoppingBag, ArrowRight, Search } from "lucide-react";
import { OrderCard } from "../components/OrderCard";
import { Button } from "@/components/ui/Button";
import { useBuyerOrdersQuery } from "../hooks/useBuyerOrders";
import { Pagination } from "@/components/ui/Pagination";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OrderListViewProps {
  page: number;
  limit: number;
  status: string;
  search: string;
}

export function OrderListView({ page, limit, status, search }: OrderListViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const { data: ordersData, isLoading, error } = useBuyerOrdersQuery({ page, limit, status, search });

  const orders = ordersData?.orders || [];
  const totalPages = ordersData?.totalPages || 0;
  const totalCount = ordersData?.totalCount || 0;
  const stats = ordersData?.stats || { ALL: 0, PENDING: 0, IN_PROGRESS: 0, SHIPPED: 0, DELIVERED: 0, CANCELLED: 0 };

  const [searchTerm, setSearchTerm] = useState(search);
  const [statusFilter, setStatusFilter] = useState(status);

  useEffect(() => {
    setSearchTerm(search);
  }, [search]);

  useEffect(() => {
    setStatusFilter(status);
  }, [status]);

  const updateQueryParams = useCallback(
    (updates: Record<string, string | number>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (key === "page" && value === 1) {
          params.delete(key);
        } else if (value === "" || value === "ALL") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams]
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== search) {
        updateQueryParams({ search: searchTerm, page: 1 });
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, search, updateQueryParams]);

  const handleTabChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    updateQueryParams({ status: newStatus, page: 1 });
  };

  return (
    <section className="max-w-5xl mx-auto px-margin-page py-16">
      {/* Order List Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-8">
        <div>
          <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-1">
            YOUR PURCHASES
          </h3>
          <p className="font-body-lg text-body-lg text-outline italic">
            Refining the timeline of your curated collection.
          </p>
        </div>
      </div>

      {/* Filters & Tabs */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between border-b border-outline-variant/10 pb-4 gap-6 mb-12">
        <div className="flex flex-wrap gap-4 md:gap-8">
          {[
            { label: "All Orders", value: "ALL", count: stats.ALL },
            { label: "Pending", value: "PENDING", count: stats.PENDING },
            { label: "In Progress", value: "IN_PROGRESS", count: stats.IN_PROGRESS },
            { label: "Shipped", value: "SHIPPED", count: stats.SHIPPED },
            { label: "Delivered", value: "DELIVERED", count: stats.DELIVERED },
            { label: "Cancelled", value: "CANCELLED", count: stats.CANCELLED },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={cn(
                "font-label-caps text-[11px] md:text-sm pb-4 transition-all relative font-bold tracking-widest cursor-pointer bg-transparent border-none outline-none",
                statusFilter === tab.value
                  ? "text-primary"
                  : "text-on-surface-variant/40 hover:text-primary",
              )}
            >
              {tab.label.toUpperCase()} ({tab.count})
              {statusFilter === tab.value && (
                <motion.div
                  layoutId="activeBuyerOrderTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
            <input
              type="text"
              placeholder="Search purchases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant/30 pl-10 pr-4 py-2.5 rounded-xl font-body-md text-sm text-primary placeholder:text-on-surface-variant/40 hover:border-primary transition-all focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary h-11"
            />
          </div>

          <div className="relative w-full sm:w-auto">
            <select
              value={limit}
              onChange={(e) => updateQueryParams({ limit: Number(e.target.value), page: 1 })}
              className="appearance-none w-full sm:w-auto bg-surface-container-low border border-outline-variant/30 px-6 pr-10 py-2.5 rounded-xl font-label-caps text-[11px] text-primary font-bold tracking-wider hover:border-primary transition-all focus:outline-none cursor-pointer h-11"
            >
              <option value={5}>5 PER PAGE</option>
              <option value={10}>10 PER PAGE</option>
              <option value={20}>20 PER PAGE</option>
              <option value={50}>50 PER PAGE</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary/40 text-[18px]">
              expand_more
            </span>
          </div>
        </div>
      </div>

      {/* LOADING SHIMMER STATE */}
      {(isLoading || isPending) && (
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
      {error && !isLoading && !isPending && (
        <div className="py-16 text-center space-y-4 bg-white border border-outline-variant/20 rounded-2xl p-8 max-w-md mx-auto">
          <p className="text-sm text-rose-500 font-medium">Failed to retrieve order history.</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="mx-auto">
            Try Again
          </Button>
        </div>
      )}

      {/* EMPTY STATE */}
      {!isLoading && !isPending && !error && orders.length === 0 && (
        <div className="py-24 text-center max-w-md mx-auto space-y-6">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h4 className="font-serif text-lg text-slate-800 font-semibold">No purchases found</h4>
            <p className="text-slate-500 text-xs leading-relaxed">
              We couldn't find any orders matching your criteria.
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
      {!isLoading && !isPending && !error && orders.length > 0 && (
        <div className="space-y-12">
          {orders.map((order: any) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      {/* PAGINATION COMPONENT */}
      {!isLoading && !isPending && !error && totalPages > 1 && (
        <div className="mt-16 pt-8 border-t border-outline-variant/15">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(pageNum) => updateQueryParams({ page: pageNum })}
          />
        </div>
      )}

      {/* End of list indicator */}
      {!isLoading && !isPending && !error && orders.length > 0 && (
        <div className="py-16 text-center">
          <p className="font-label-caps text-[9px] text-outline/50 tracking-[0.4em] uppercase">
            Curated Collection Synchronized
          </p>
        </div>
      )}
    </section>
  );
}

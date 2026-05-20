"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {
  Banknote,
  TrendingUp,
  Truck,
  ArrowRight,
  Package,
} from "lucide-react";
import { useSellerOrdersQuery } from "@/features/seller/orders/hooks/useSellerOrders";

export function DashboardView() {
  const { data, isLoading } = useSellerOrdersQuery();
  const orders = data?.orders || [];

  // 1. Calculate live totals from database orders
  const paidOrders = orders.filter((o) => o.paymentStatus === "PAID");
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.price * o.quantity, 0);

  const activeOrdersCount = orders.filter(
    (o) => o.status !== "DELIVERED" && o.status !== "CANCELLED"
  ).length;

  // Format currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    });
  };

  // Get up to 5 recent orders
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="px-4 md:px-margin-page py-8 md:py-16 space-y-16 md:space-y-section-gap max-w-container-max mx-auto">
      {/* Stats Section */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-gutter">
        
        {/* Total Revenue Card */}
        <div className="lg:col-span-3 bg-slate-900 text-white p-8 md:p-12 rounded-[32px] md:rounded-[48px] shadow-sm relative overflow-hidden group min-h-[240px]">
          <div className="absolute -right-4 -top-4 p-8 opacity-10">
            <Banknote size={160} strokeWidth={1} />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <p className="font-label-caps text-xs md:text-sm opacity-80 mb-2">
                Total Revenue
              </p>
              <h3 className="font-display-lg text-4xl md:text-5xl tracking-tight">
                {isLoading ? "₹..." : formatCurrency(totalRevenue)}
              </h3>
            </div>
            <div className="flex items-center gap-3 mt-8 md:mt-12">
              <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold flex items-center gap-1">
                <TrendingUp size={14} strokeWidth={2.5} />
                Live Shop Billing
              </span>
              <div className="flex-1 h-[2px] rounded-full bg-white/10"></div>
            </div>
          </div>
        </div>

        {/* Active Orders Card */}
        <div className="lg:col-span-1 bg-surface-container-low p-8 rounded-[32px] border border-outline-variant/10 shadow-sm flex flex-col justify-between min-h-[240px]">
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="font-label-caps text-xs text-on-surface-variant">
                Active Orders
              </p>
              <Truck size={24} className="text-on-surface-variant/30" />
            </div>
            <h3 className="font-display-lg text-4xl md:text-5xl">
              {isLoading ? "..." : activeOrdersCount}
            </h3>
          </div>
          <div className="flex items-end gap-1 h-12 mt-6 opacity-60">
            {[40, 70, 55, 100, 85].map((h, i) => (
              <div
                key={i}
                className="w-1.5 bg-slate-900 rounded-full"
                style={{ height: `${h}%` }}
              ></div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Orders Section */}
      <section>
        <div className="flex justify-between items-end mb-8 md:mb-12">
          <div>
            <h3 className="font-headline-md text-2xl md:text-3xl font-serif">
              Recent Sales
            </h3>
            <p className="text-on-surface-variant text-xs md:text-sm mt-1">
              Track and fulfill your latest customer requests
            </p>
          </div>
          <Link 
            href="/seller/orders"
            className="font-label-caps text-[10px] md:text-xs text-primary flex items-center gap-2 hover:gap-4 transition-all tracking-widest group"
          >
            FULFILLMENT CENTER
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* LOADING SHIMMER */}
        {isLoading && (
          <div className="bg-slate-50 border border-slate-200 rounded-[32px] h-48 animate-pulse w-full"></div>
        )}

        {/* EMPTY SALES STATE */}
        {!isLoading && recentOrders.length === 0 && (
          <div className="bg-white border border-outline-variant/10 p-12 text-center rounded-[32px] max-w-sm mx-auto space-y-4">
            <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <Package size={20} />
            </div>
            <div className="space-y-1">
              <h4 className="font-serif text-sm font-semibold text-slate-800">No sales recorded yet</h4>
              <p className="text-slate-500 text-xs">
                Your listings are active! New customer orders will appear here automatically.
              </p>
            </div>
          </div>
        )}

        {/* SALES GRID */}
        {!isLoading && recentOrders.length > 0 && (
          <div className="bg-surface-container-low rounded-[32px] md:rounded-[56px] border border-outline-variant/10 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-outline-variant/10 bg-surface-container-high/30">
                    <th className="px-8 md:px-10 py-6 text-left font-label-caps text-[9px] md:text-[10px] tracking-widest text-on-surface-variant/60">
                      ORDER & DATE
                    </th>
                    <th className="px-8 md:px-10 py-6 text-left font-label-caps text-[9px] md:text-[10px] tracking-widest text-on-surface-variant/60">
                      BUYER
                    </th>
                    <th className="px-8 md:px-10 py-6 text-left font-label-caps text-[9px] md:text-[10px] tracking-widest text-on-surface-variant/60">
                      CURATED ITEM
                    </th>
                    <th className="px-8 md:px-10 py-6 text-left font-label-caps text-[9px] md:text-[10px] tracking-widest text-on-surface-variant/60">
                      FULFILLMENT STATUS
                    </th>
                    <th className="px-8 md:px-10 py-6 text-right font-label-caps text-[9px] md:text-[10px] tracking-widest text-on-surface-variant/60">
                      REVENUE
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {recentOrders.map((order) => {
                    const initials = order.customerName
                      ? order.customerName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                      : "CU";

                    return (
                      <tr
                        key={order.id}
                        className="group hover:bg-surface-container-high/20 transition-colors font-sans text-xs text-slate-700"
                      >
                        <td className="px-8 md:px-10 py-8">
                          <p className="font-bold text-sm">#{order.orderId.slice(-6).toUpperCase()}</p>
                          <p className="text-[10px] md:text-xs text-on-surface-variant/60 mt-1 italic">
                            {order.orderDate}
                          </p>
                        </td>
                        <td className="px-8 md:px-10 py-8">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                              {initials}
                            </div>
                            <p className="text-sm font-semibold text-slate-800">
                              {order.customerName}
                            </p>
                          </div>
                        </td>
                        <td className="px-8 md:px-10 py-8">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden border border-outline-variant/10 shrink-0 relative">
                              <Image
                                src={order.productImage}
                                alt={order.productTitle}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-800 truncate max-w-[150px]">
                                {order.productTitle}
                              </p>
                              <p className="text-[10px] text-slate-400 mt-0.5">Quantity: {order.quantity}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 md:px-10 py-8">
                          <span
                            className={cn(
                              "text-[9px] md:text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full font-bold border",
                              order.status === "DELIVERED"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : order.status === "SHIPPED"
                                ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                : order.status === "CANCELLED"
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            )}
                          >
                            {order.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="px-8 md:px-10 py-8 text-right font-bold text-slate-900 text-sm">
                          {formatCurrency(order.price * order.quantity)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="p-8 md:p-10 border-t border-outline-variant/5 text-center">
              <Link 
                href="/seller/orders"
                className="text-slate-800 font-label-caps text-[10px] md:text-xs tracking-widest hover:underline underline-offset-4 font-bold"
              >
                GO TO FULFILLMENT CENTER
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

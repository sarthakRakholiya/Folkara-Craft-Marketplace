"use client";

import React, { useState, useEffect, useCallback, useTransition } from "react";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { getShippingLabelHtml } from "../utils/shippingLabel";
import {
  Search,
  Package,
  ChevronDown,
  Calendar,
  ArrowLeft,
  MapPin,
  CreditCard,
  Lock,
  Printer,
  Truck,
  Mail
} from "lucide-react";
import {
  useSellerOrdersQuery,
  useUpdateOrderStatusMutation,
  useUpdateOrderTrackingMutation
} from "../hooks/useSellerOrders";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Pagination } from "@/components/ui/Pagination";

export interface SellerOrder {
  id: string;
  orderId: string;
  productId: string;
  productTitle: string;
  productImage: string;
  price: number;
  quantity: number;
  customerName: string;
  shippingAddress: string;
  deliveryMethod: string;
  orderDate: string;
  status: "PENDING" | "IN_PROGRESS" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus: "UNPAID" | "PAID" | "FAILED";
  trackingNumber: string | null;
  orderTotal: number;
  subtotal: number;
  shippingCost: number;
  tax: number;
  artisanNote: string;
}

interface OrderDetailSubViewProps {
  activeOrder: SellerOrder;
  setSelectedOrder: (order: SellerOrder | null) => void;
  formatCurrency: (amount: number) => string;
  updateTrackingMut: {
    mutate: (vars: { orderId: string; trackingNumber: string }) => void;
    isPending: boolean;
  };
  updateStatusMut: {
    mutate: (vars: { orderId: string; status: "PENDING" | "IN_PROGRESS" | "SHIPPED" | "DELIVERED" | "CANCELLED" }) => void;
    isPending: boolean;
  };
  activeStatusMenuOrderId: string | null;
  setActiveStatusMenuOrderId: (id: string | null) => void;
  handleToggleStatusMenu: (id: string) => void;
}

function OrderDetailSubView({
  activeOrder,
  setSelectedOrder,
  formatCurrency,
  updateTrackingMut,
  updateStatusMut,
  activeStatusMenuOrderId,
  setActiveStatusMenuOrderId,
  handleToggleStatusMenu,
}: OrderDetailSubViewProps) {
  const [detailTrackingNumber, setDetailTrackingNumber] = useState(activeOrder.trackingNumber || "");
  const [isLabelGenerating, setIsLabelGenerating] = useState(false);

  const isShipped = activeOrder.status === "SHIPPED";
  const isDelivered = activeOrder.status === "DELIVERED";
  const isCancelled = activeOrder.status === "CANCELLED";
  const isInProgress = activeOrder.status === "IN_PROGRESS";

  const customerInitials = activeOrder.customerName
    ? activeOrder.customerName.split(" ").map((n: string) => n[0]).join("").toUpperCase()
    : "CU";

  const customerEmail = activeOrder.customerName
    ? `${activeOrder.customerName.toLowerCase().replace(/\s+/g, "")}@example.com`
    : "buyer@folkara.com";

  const handleSaveDetailTracking = () => {
    if (!detailTrackingNumber.trim()) return;
    updateTrackingMut.mutate({
      orderId: activeOrder.orderId,
      trackingNumber: detailTrackingNumber
    });
  };

  const handleDetailStatusChange = (status: "PENDING" | "IN_PROGRESS" | "SHIPPED" | "DELIVERED" | "CANCELLED") => {
    updateStatusMut.mutate({
      orderId: activeOrder.orderId,
      status
    });
  };

  const handleGenerateLabel = () => {
    setIsLabelGenerating(true);
    setTimeout(() => {
      setIsLabelGenerating(false);
      toast.success("Shipping label successfully generated!");

      // Open a popup print window
      const printWindow = window.open("", "_blank", "width=600,height=800");
      if (!printWindow) {
        toast.error("Failed to open print window. Please allow popups in your browser settings.");
        return;
      }

      printWindow.document.write(getShippingLabelHtml(activeOrder));
      printWindow.document.close();
    }, 1500);
  };

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 !pb-24">
      {/* Breadcrumb Back Button */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => setSelectedOrder(null)}
          className="flex items-center gap-2 text-outline hover:text-primary transition-all duration-300 group cursor-pointer bg-transparent border-none outline-none"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-label-caps text-xs tracking-widest font-bold">Back to Orders</span>
        </button>
      </div>

      {/* Page Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-outline mb-2">
            <span className="font-label-caps text-[10px]">Orders</span>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span className="font-label-caps text-[10px]">#{activeOrder.orderId.substring(0, 8).toUpperCase()}</span>
          </nav>
          <h2 className="font-headline-md text-3xl text-primary font-notoSerif italic">Fulfillment Details</h2>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {/* Interactive Status Dropdown */}
          <div className="relative">
            <button
              onClick={() => handleToggleStatusMenu(activeOrder.id)}
              className={cn(
                "px-4 py-2 rounded-xl font-label-caps text-[10px] font-bold tracking-widest border transition-all cursor-pointer flex items-center gap-1.5",
                isDelivered
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200/50 hover:bg-emerald-100"
                  : isShipped
                    ? "bg-indigo-50 text-indigo-700 border-indigo-200/50 hover:bg-indigo-100"
                    : isCancelled
                      ? "bg-rose-50 text-rose-700 border-rose-200/50 hover:bg-rose-100"
                      : isInProgress
                        ? "bg-amber-50 text-amber-700 border-amber-200/50 hover:bg-amber-100"
                        : "bg-surface-container text-primary border-outline-variant/30 hover:bg-surface-container-high"
              )}
            >
              <span>Fulfillment: {activeOrder.status.replace("_", " ")}</span>
              <ChevronDown className="w-3.5 h-3.5 text-current shrink-0" />
            </button>

            {activeStatusMenuOrderId === activeOrder.id && (
              <div className="absolute top-12 left-0 bg-white border border-outline-variant/60 rounded-2xl shadow-2xl z-30 py-2 w-40 flex flex-col font-label-caps text-[10px] tracking-widest font-bold max-h-48 overflow-y-auto">
                {["PENDING", "IN_PROGRESS", "SHIPPED", "DELIVERED", "CANCELLED"].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      handleDetailStatusChange(st as "PENDING" | "IN_PROGRESS" | "SHIPPED" | "DELIVERED" | "CANCELLED");
                      setActiveStatusMenuOrderId(null);
                    }}
                    className="w-full text-left px-4 py-2 text-[10px] text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-colors uppercase font-bold tracking-widest bg-transparent border-none outline-none"
                  >
                    {st.replace("_", " ")}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Static Payment Badge */}
          <div className={cn(
            "px-4 py-2 rounded-xl font-label-caps text-[10px] font-bold tracking-widest border flex items-center gap-1.5",
            activeOrder.paymentStatus === "PAID"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200/50"
              : activeOrder.paymentStatus === "FAILED"
                ? "bg-rose-50 text-rose-700 border-rose-200/50"
                : "bg-amber-50 text-amber-700 border-amber-200/50"
          )}>
            <span>Billing: {activeOrder.paymentStatus}</span>
          </div>

          <p className="text-outline text-label-caps font-label-caps text-xs">Ordered {activeOrder.orderDate}</p>
        </div>
      </div>

      {/* Split Layout Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Order Details */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          {/* Buyer Info Card */}
          <section className="bg-surface-container-low/40 p-8 rounded-3xl border border-outline-variant/10 shadow-sm backdrop-blur-sm">
            <h3 className="font-label-caps text-[10px] text-outline font-bold tracking-widest uppercase mb-6">Customer & Delivery</h3>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center border border-outline-variant/20 shadow-inner">
                  <span className="font-headline-sm text-lg text-primary font-bold font-serif">{customerInitials}</span>
                </div>
                <div>
                  <h4 className="font-headline-sm text-lg text-primary font-bold">{activeOrder.customerName}</h4>
                  <p className="text-on-surface-variant text-sm flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3.5 h-3.5 text-outline" />
                    {customerEmail}
                  </p>
                </div>
              </div>
              <a
                href={`mailto:${customerEmail}`}
                className="px-4 py-2 text-primary font-label-caps text-[10px] font-bold tracking-widest border border-primary/20 hover:border-primary rounded-xl transition-all text-center self-start sm:self-auto cursor-pointer font-bold"
              >
                Message Buyer
              </a>
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-outline-variant/15 pt-8">
              <div>
                <p className="font-label-caps text-[9px] text-outline font-bold uppercase tracking-widest mb-3 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-outline" /> Shipping Address
                </p>
                <p className="text-body-md leading-relaxed text-primary/80 text-sm whitespace-pre-line">
                  {activeOrder.shippingAddress}
                </p>
              </div>
              <div>
                <p className="font-label-caps text-[9px] text-outline font-bold uppercase tracking-widest mb-3 flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-outline" /> Billing Parameters
                </p>
                <p className="text-body-md text-sm text-primary font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  Visa ending in •••• 4492
                </p>
                <p className="text-on-surface-variant text-xs mt-1">Paid on {activeOrder.orderDate}</p>
              </div>
            </div>
          </section>

          {/* Item Breakdown Card */}
          <section className="bg-surface-container-low/40 p-8 rounded-3xl border border-outline-variant/10 shadow-sm backdrop-blur-sm">
            <h3 className="font-label-caps text-[10px] text-outline font-bold tracking-widest uppercase mb-6">Order Summary</h3>
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="w-24 h-28 bg-surface-container rounded-2xl relative overflow-hidden shrink-0 border border-outline-variant/20 shadow-md">
                  <Image
                    src={activeOrder.productImage}
                    alt={activeOrder.productTitle}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-headline-sm text-lg text-primary font-bold line-clamp-1">{activeOrder.productTitle}</h5>
                  <p className="text-on-surface-variant text-xs mt-0.5">Signature Series • Hand-crafted Artisan Masterpiece</p>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span className="px-2.5 py-0.5 bg-surface-container-low text-on-surface-variant rounded-lg text-[9px] uppercase tracking-widest font-bold border border-outline-variant/10">
                      QTY: {activeOrder.quantity}
                    </span>
                    <span className="px-2.5 py-0.5 bg-surface-container-low text-on-surface-variant rounded-lg text-[9px] uppercase tracking-widest font-bold border border-outline-variant/10">
                      Standard Size
                    </span>
                  </div>
                </div>
                <p className="font-headline-sm text-base text-primary font-bold shrink-0 self-start sm:self-auto">
                  {formatCurrency(activeOrder.price)}
                </p>
              </div>
            </div>
            <div className="mt-10 pt-6 border-t border-outline-variant/15 space-y-3">
              <div className="flex justify-between text-body-md text-sm text-on-surface-variant">
                <span>Subtotal</span>
                <span>{formatCurrency(activeOrder.price * activeOrder.quantity)}</span>
              </div>
              <div className="flex justify-between text-body-md text-sm text-on-surface-variant">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-outline" /> Delivery Method ({activeOrder.deliveryMethod})
                </span>
                <span>{activeOrder.shippingCost === 0 ? "FREE" : formatCurrency(activeOrder.shippingCost)}</span>
              </div>
              <div className="flex justify-between text-body-md text-sm text-on-surface-variant">
                <span>Tax & Platform Fee</span>
                <span>{formatCurrency(activeOrder.tax || 0)}</span>
              </div>
              <div className="flex justify-between font-headline-sm text-base text-primary font-bold pt-4 border-t border-dashed border-outline-variant/10">
                <span>Grand Total</span>
                <span>{formatCurrency(activeOrder.orderTotal)}</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Side: Shipping Actions & Updates */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          {/* Fulfillment Actions */}
          <section className="bg-primary p-8 rounded-3xl text-on-primary shadow-xl border border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.03] rounded-full translate-x-12 -translate-y-12"></div>
            <h3 className="font-label-caps text-[9px] text-primary-fixed-dim/60 font-bold tracking-widest mb-6 uppercase">Fulfillment Actions</h3>
            <div className="space-y-4">
              <button
                onClick={handleGenerateLabel}
                disabled={isLabelGenerating}
                className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/15 disabled:opacity-50 transition-all rounded-2xl group cursor-pointer text-left border-none outline-none text-on-primary"
              >
                <div className="flex items-center gap-4">
                  {isLabelGenerating ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Printer className="text-primary-fixed-dim w-5 h-5" />
                  )}
                  <span className="font-label-caps text-[10px] tracking-widest font-bold">
                    {isLabelGenerating ? "GENERATING LABEL..." : "GENERATE SHIPPING LABEL"}
                  </span>
                </div>
                <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
              </button>

              <button
                onClick={() => handleDetailStatusChange("SHIPPED")}
                disabled={isShipped || isDelivered}
                className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/15 disabled:opacity-50 transition-all rounded-2xl group cursor-pointer text-left border-none outline-none text-on-primary"
              >
                <div className="flex items-center gap-4">
                  <Truck className="text-primary-fixed-dim w-5 h-5" />
                  <span className="font-label-caps text-[10px] tracking-widest font-bold">
                    {isShipped ? "ALREADY SHIPPED" : isDelivered ? "ALREADY DELIVERED" : "MARK AS SHIPPED"}
                  </span>
                </div>
                <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
              </button>

              <div className="pt-4 mt-4 border-t border-white/10">
                <p className="font-label-caps text-[9px] text-primary-fixed-dim/60 font-bold tracking-widest mb-2 uppercase">Tracking Number</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={detailTrackingNumber}
                    onChange={(e) => setDetailTrackingNumber(e.target.value)}
                    placeholder="e.g. UPS-882-991"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-on-primary placeholder:text-white/30 focus:ring-1 focus:ring-primary-fixed-dim focus:border-transparent outline-none font-mono"
                  />
                  <button
                    onClick={handleSaveDetailTracking}
                    disabled={updateTrackingMut.isPending}
                    className="bg-primary-fixed-dim hover:bg-white text-primary font-label-caps text-[9px] font-bold tracking-widest px-4 rounded-xl transition-all cursor-pointer disabled:opacity-50 border-none outline-none font-bold"
                  >
                    {updateTrackingMut.isPending ? "SAVING..." : "ADD"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

interface SellerOrdersViewProps {
  page: number;
  limit: number;
  status: string;
  search: string;
}

export function SellerOrdersView({ page, limit, status, search }: SellerOrdersViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const { data: ordersData, isLoading, error } = useSellerOrdersQuery({
    page,
    limit,
    status,
    search,
  });

  const orders = ordersData?.orders || [];
  const totalCount = ordersData?.totalCount || 0;
  const totalPages = ordersData?.totalPages || 0;
  const stats = ordersData?.stats || {
    ALL: 0,
    PENDING: 0,
    IN_PROGRESS: 0,
    SHIPPED: 0,
    DELIVERED: 0,
    CANCELLED: 0,
  };

  // Mutations
  const updateStatusMut = useUpdateOrderStatusMutation();
  const updateTrackingMut = useUpdateOrderTrackingMutation();

  // Selected Order for high fidelity Fulfillment Detail View
  const [selectedOrder, setSelectedOrder] = useState<SellerOrder | null>(null);

  // Resolve the active order dynamically for live status and updates propagation
  const activeOrder = selectedOrder
    ? ((orders as SellerOrder[]).find((o) => o.id === selectedOrder.id) || selectedOrder)
    : null;

  // Filters & Search State synced with props
  const [searchTerm, setSearchTerm] = useState(search);
  const [statusFilter, setStatusFilter] = useState(status);

  useEffect(() => {
    setSearchTerm(search);
  }, [search]);

  useEffect(() => {
    setStatusFilter(status);
  }, [status]);

  // Update query parameters in the URL with transitions
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

  // Debounce search input to update URL
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== search) {
        updateQueryParams({ search: searchTerm, page: 1 });
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, search, updateQueryParams]);

  // Menu Dropdown trackers
  const [activeStatusMenuOrderId, setActiveStatusMenuOrderId] = useState<string | null>(null);

  // Outside Click Listener to close active dropdowns
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".relative")) {
        setActiveStatusMenuOrderId(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Filter logic (Server-side now handles this, but mapping to matches for compatibility)
  const filteredOrders = orders;

  // Toggle status drop down
  const handleToggleStatusMenu = (orderId: string) => {
    setActiveStatusMenuOrderId(activeStatusMenuOrderId === orderId ? null : orderId);
  };

  // Trigger Status transition
  const handleUpdateStatus = (
    orderId: string,
    status: "PENDING" | "IN_PROGRESS" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  ) => {
    updateStatusMut.mutate({ orderId, status });
    setActiveStatusMenuOrderId(null);
  };

  // Tab change handler
  const handleTabChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    updateQueryParams({ status: newStatus, page: 1 });
  };

  // Limit change handler
  const handleLimitChange = (newLimit: number) => {
    updateQueryParams({ limit: newLimit, page: 1 });
  };

  // Page change handler
  const handlePageChange = (newPage: number) => {
    updateQueryParams({ page: newPage });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    });
  };

  if (activeOrder) {
    return (
      <OrderDetailSubView
        key={activeOrder.id}
        activeOrder={activeOrder}
        setSelectedOrder={setSelectedOrder}
        formatCurrency={formatCurrency}
        updateTrackingMut={updateTrackingMut}
        updateStatusMut={updateStatusMut}
        activeStatusMenuOrderId={activeStatusMenuOrderId}
        setActiveStatusMenuOrderId={setActiveStatusMenuOrderId}
        handleToggleStatusMenu={handleToggleStatusMenu}
      />
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 mt-10 space-y-10 pb-24">

      {/* Page Title & AI Artisan Guide Pulse */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 md:mb-12 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <h2 className="font-headline-md text-3xl md:text-4xl text-primary font-notoSerif">
              Incoming Shop Orders
            </h2>
          </div>
          <p className="font-body-lg text-base md:text-lg text-on-surface-variant max-w-2xl italic leading-relaxed">
            &quot;The craftsman&quot;s work is the outward expression of an inward stillness.&quot; <br className="hidden md:block" />
            Fulfill direct purchases, trace delivery parameters, and synchronize billing statements.
          </p>
        </div>

        {/* Sales Pipeline Alert Guide */}
        <div className="bg-secondary/5 p-6 rounded-[2rem] border border-secondary/10 relative overflow-hidden group max-w-xs w-full shadow-sm">
          <div className="flex gap-4 relative z-10">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-secondary animate-pulse text-[20px]">
                auto_awesome
              </span>
            </div>
            <div>
              <p className="font-headline-sm text-[15px] italic text-secondary leading-tight mb-1">
                Fulfillment Insight
              </p>
              <p className="font-body-md text-[12px] text-secondary/70 leading-relaxed">
                {stats.PENDING > 0
                  ? `You have ${stats.PENDING} pending orders waiting for preparation. Keep up the high standard!`
                  : "All current incoming orders are fully processed and shipped."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TABS FILTER BAR (Exactly like Listings Gallery) */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between border-b border-outline-variant/10 pb-4 gap-6">
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
                  layoutId="activeOrderTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Search Input Bar & Items Per Page Dropdown (Sleek layout matching listings) */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
          {/* Items Per Page Dropdown */}
          <div className="relative w-full sm:w-auto shrink-0">
            <select
              value={limit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
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

          {/* Search Box */}
          <div className="relative group w-full sm:w-80">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-outline" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search product, customer, or ID..."
              className="appearance-none w-full bg-surface-container-low border border-outline-variant/30 pl-10 pr-4 py-2.5 rounded-xl font-body-md text-[13px] text-primary hover:border-primary transition-all focus:outline-none focus:border-primary h-11"
            />
          </div>
        </div>
      </div>

      {/* ERROR STATE */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center text-rose-700 text-xs font-semibold">
          An error occurred while loading order metrics. Please reload.
        </div>
      )}

      {/* LOADING STATE */}
      {(isLoading || isPending) && (
        <div className="space-y-4 animate-pulse">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="bg-slate-100/60 border border-slate-200 rounded-2xl h-28 w-full"></div>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!isLoading && !isPending && !error && filteredOrders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 min-h-[400px] text-center bg-surface-container-lowest/30 rounded-[3rem] border border-dashed border-outline-variant/30 max-w-xl mx-auto px-6">
          <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-6">
            <Package className="w-8 h-8 text-outline-variant" />
          </div>
          <h3 className="text-xl font-headline-sm text-primary italic mb-2">
            No matching orders found
          </h3>
          <p className="text-on-surface-variant/60 max-w-sm mx-auto text-sm leading-relaxed">
            We couldn&apos;t find any incoming shop transactions fitting the chosen search or status filter.
          </p>
        </div>
      )}

      {/* ACTIVE SALES TABLE / GRID */}
      {!isLoading && !isPending && !error && filteredOrders.length > 0 && (
        <div className="bg-surface-container-lowest/30 rounded-[2.5rem] border border-outline-variant/30 overflow-visible shadow-sm backdrop-blur-sm">

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-visible">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/40 border-b border-outline-variant/20 text-outline uppercase tracking-widest font-label-caps text-[10px] font-bold">
                  <th className="py-5 px-6">Curated Creation</th>
                  <th className="py-5 px-6">Customer & Address</th>
                  <th className="py-5 px-6">Timeline Details</th>
                  <th className="py-5 px-6 text-right">Revenue</th>
                  <th className="py-5 px-6">Billing</th>
                  <th className="py-5 px-6">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10 text-primary font-sans text-[13px]">
                {filteredOrders.map((order) => {
                  const isShipped = order.status === "SHIPPED";
                  const isDelivered = order.status === "DELIVERED";
                  const isCancelled = order.status === "CANCELLED";
                  const isInProgress = order.status === "IN_PROGRESS";

                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={(e) => {
                        const target = e.target as HTMLElement;
                        if (target.closest('button') || target.closest('input') || target.closest('.absolute')) {
                          return;
                        }
                        setSelectedOrder(order);
                      }}
                      className="hover:bg-primary/[0.02] transition-colors duration-200 cursor-pointer"
                    >
                      {/* Product display */}
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-14 bg-surface-container rounded-xl relative overflow-hidden shrink-0 border border-outline-variant/20 shadow-sm">
                            <Image
                              src={order.productImage}
                              alt={order.productTitle}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                          <div>
                            <h4 className="font-headline-sm text-sm text-primary font-bold line-clamp-1">{order.productTitle}</h4>
                            <div className="mt-1 flex items-center gap-1.5">
                              <span className="px-1.5 py-0.5 bg-surface-container-low text-on-surface-variant rounded-md text-[9px] uppercase tracking-widest font-bold border border-outline-variant/15">
                                Qty: {order.quantity}
                              </span>
                              <span className="text-[10px] text-outline font-medium">Ref: #{order.orderId.substring(0, 8)}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Recipient */}
                      <td className="py-5 px-6 max-w-[220px]">
                        <div className="space-y-1">
                          <p className="font-serif text-sm font-medium text-primary">
                            {order.customerName}
                          </p>
                          <p className="text-on-surface-variant/70 font-body-sm text-[11px] leading-relaxed line-clamp-2" title={order.shippingAddress}>
                            {order.shippingAddress}
                          </p>
                        </div>
                      </td>

                      {/* Date & method */}
                      <td className="py-5 px-6">
                        <div className="space-y-2">
                          <p className="text-primary font-bold font-sans text-xs flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-outline-variant" />
                            {order.orderDate}
                          </p>
                          <div className="flex items-center gap-1.5 text-on-surface-variant text-[10px] font-semibold tracking-wider uppercase">
                            <Truck className="w-3.5 h-3.5 text-outline" />
                            <span>{order.deliveryMethod}</span>
                          </div>
                        </div>
                      </td>

                      {/* Financial Revenue */}
                      <td className="py-5 px-6 text-right font-headline-sm text-sm text-primary font-bold">
                        {formatCurrency(order.price * order.quantity)}
                      </td>

                      {/* Billing / Payment Status */}
                      <td className="py-5 px-6">
                        <span
                          className={cn(
                            "inline-flex px-3 py-1.5 rounded-xl font-label-caps text-[9px] font-bold tracking-widest border",
                            order.paymentStatus === "PAID"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200/50"
                              : order.paymentStatus === "FAILED"
                                ? "bg-rose-50 text-rose-700 border-rose-200/50"
                                : "bg-amber-50 text-amber-700 border-amber-200/50"
                          )}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>

                      {/* Fulfillment Status */}
                      <td className="py-5 px-6 relative">
                        <button
                          onClick={() => handleToggleStatusMenu(order.id)}
                          className={cn(
                            "px-3 py-1.5 rounded-xl font-label-caps text-[9px] font-bold tracking-widest border transition-all cursor-pointer flex items-center gap-1.5",
                            isDelivered
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200/50 hover:bg-emerald-100"
                              : isShipped
                                ? "bg-indigo-50 text-indigo-700 border-indigo-200/50 hover:bg-indigo-100"
                                : isCancelled
                                  ? "bg-rose-50 text-rose-700 border-rose-200/50 hover:bg-rose-100"
                                  : isInProgress
                                    ? "bg-amber-50 text-amber-700 border-amber-200/50 hover:bg-amber-100"
                                    : "bg-surface-container text-primary border-outline-variant/30 hover:bg-surface-container-high"
                          )}
                        >
                          {order.status.replace("_", " ")}
                          <ChevronDown className="w-3 h-3 text-current shrink-0" />
                        </button>

                        {/* Interactive Dropdown */}
                        {activeStatusMenuOrderId === order.id && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-14 left-6 bg-white border border-outline-variant/60 rounded-2xl shadow-2xl z-30 py-2 w-36 flex flex-col font-label-caps text-[10px] tracking-widest font-bold max-h-48 overflow-y-auto"
                          >
                            {["PENDING", "IN_PROGRESS", "SHIPPED", "DELIVERED", "CANCELLED"].map((st) => (
                              <button
                                key={st}
                                onClick={() => handleUpdateStatus(order.orderId, st as "PENDING" | "IN_PROGRESS" | "SHIPPED" | "DELIVERED" | "CANCELLED")}
                                className="w-full text-left px-4 py-2 text-[10px] text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-colors uppercase font-bold tracking-widest bg-transparent border-none outline-none"
                              >
                                {st.replace("_", " ")}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile responsive Cards Grid */}
          <div className="lg:hidden divide-y divide-outline-variant/10">
            {filteredOrders.map((order) => {
              const isShipped = order.status === "SHIPPED";
              const isDelivered = order.status === "DELIVERED";
              const isCancelled = order.status === "CANCELLED";
              const isInProgress = order.status === "IN_PROGRESS";

              return (
                <div
                  key={order.id}
                  onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.closest('button') || target.closest('input') || target.closest('.absolute')) {
                      return;
                    }
                    setSelectedOrder(order);
                  }}
                  className="p-6 space-y-4 bg-surface-container-lowest/10 hover:bg-primary/[0.01] transition-all cursor-pointer"
                >
                  {/* Header title */}
                  <div className="flex gap-4">
                    <div className="w-14 h-16 bg-surface-container rounded-xl relative overflow-hidden shrink-0 border border-outline-variant/20 shadow-sm">
                      <Image
                        src={order.productImage}
                        alt={order.productTitle}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-headline-sm text-sm text-primary font-bold truncate">{order.productTitle}</h4>
                      <p className="text-[10px] text-outline mt-1 font-mono uppercase tracking-wider">Ref: #{order.orderId.substring(0, 8)}</p>
                    </div>
                    <span className="font-headline-sm text-sm text-primary font-bold shrink-0">{formatCurrency(order.price * order.quantity)}</span>
                  </div>

                  {/* Details grid list */}
                  <div className="grid grid-cols-2 gap-y-4 pt-4 border-t border-outline-variant/10 text-[11px] text-on-surface-variant">
                    <div>
                      <span className="font-label-caps text-[9px] text-outline font-bold uppercase tracking-widest">Customer</span>
                      <p className="font-serif text-sm font-medium text-primary mt-1">{order.customerName}</p>
                    </div>
                    <div>
                      <span className="font-label-caps text-[9px] text-outline font-bold uppercase tracking-widest">Courier Speed</span>
                      <div className="flex items-center gap-1 mt-1 text-primary font-bold uppercase tracking-wider">
                        <Truck className="w-3.5 h-3.5 text-outline" />
                        <span>{order.deliveryMethod}</span>
                      </div>
                    </div>
                    <div>
                      <span className="font-label-caps text-[9px] text-outline font-bold uppercase tracking-widest">Fulfillment Status</span>
                      <div className="relative mt-1">
                        <button
                          onClick={() => handleToggleStatusMenu(order.id)}
                          className={cn(
                            "px-2.5 py-1 rounded-lg font-label-caps text-[8px] font-bold tracking-widest border flex items-center gap-1 cursor-pointer",
                            isDelivered
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200/50"
                              : isShipped
                                ? "bg-indigo-50 text-indigo-700 border-indigo-200/50"
                                : isCancelled
                                  ? "bg-rose-50 text-rose-700 border-rose-200/50"
                                  : isInProgress
                                    ? "bg-amber-50 text-amber-700 border-amber-200/50"
                                    : "bg-surface-container text-primary border-outline-variant/30"
                          )}
                        >
                          {order.status.replace("_", " ")}
                          <ChevronDown className="w-2.5 h-2.5 text-current shrink-0" />
                        </button>

                        {/* Interactive Status Dropdown */}
                        {activeStatusMenuOrderId === order.id && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute left-0 bottom-full mb-1 bg-white border border-outline-variant/60 rounded-2xl shadow-2xl z-30 py-2 w-36 flex flex-col font-label-caps text-[10px] tracking-widest font-bold max-h-48 overflow-y-auto"
                          >
                            {["PENDING", "IN_PROGRESS", "SHIPPED", "DELIVERED", "CANCELLED"].map((st) => (
                              <button
                                key={st}
                                onClick={() => handleUpdateStatus(order.orderId, st as "PENDING" | "IN_PROGRESS" | "SHIPPED" | "DELIVERED" | "CANCELLED")}
                                className="w-full text-left px-4 py-2 text-[10px] text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-colors uppercase font-bold tracking-widest bg-transparent border-none outline-none"
                              >
                                {st.replace("_", " ")}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="font-label-caps text-[9px] text-outline font-bold uppercase tracking-widest">Payment billing</span>
                      <div className="mt-1">
                        <span
                          className={cn(
                            "inline-flex px-2.5 py-1 rounded-lg font-label-caps text-[8px] font-bold tracking-widest border",
                            order.paymentStatus === "PAID"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200/50"
                              : order.paymentStatus === "FAILED"
                                ? "bg-rose-50 text-rose-700 border-rose-200/50"
                                : "bg-amber-50 text-amber-700 border-amber-200/50"
                          )}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* PAGINATION COMPONENT */}
      {!isLoading && !isPending && !error && totalPages > 1 && (
        <div className="mt-12 pt-8 border-t border-outline-variant/15 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

    </div>
  );
}

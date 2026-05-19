"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Loader2 } from "lucide-react";
import { OrderItem } from "../types/order";
import { getBuyerOrderInvoiceUrlAction } from "../actions/buyerOrders.actions";
import { generateInvoiceHtml } from "../constants/invoiceTemplate";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button";

interface OrderCardProps {
  order: OrderItem;
}

export function OrderCard({ order }: OrderCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const isDelivered = order.status === "DELIVERED";
  const isInTransit =
    order.status === "PENDING" ||
    order.status === "IN_PROGRESS" ||
    order.status === "SHIPPED";

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200/30";
      case "SHIPPED":
        return "bg-indigo-50 text-indigo-700 border border-indigo-200/30";
      case "PENDING":
        return "bg-amber-50 text-amber-700 border border-amber-200/30";
      case "IN_PROGRESS":
        return "bg-orange-50 text-orange-700 border border-orange-200/30";
      case "CANCELLED":
        return "bg-rose-50 text-rose-700 border border-rose-200/30";
      default:
        return "bg-surface-container-highest text-on-surface-variant border border-outline-variant/20";
    }
  };

  const handleInvoiceDownload = async () => {
    setIsDownloading(true);
    try {
      const res = await getBuyerOrderInvoiceUrlAction(order.id);
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

          const orderId = order.orderId || order.id;
          const formattedOrderId = orderId.startsWith("ord_") 
            ? orderId.slice(4).toUpperCase() 
            : orderId.slice(-8).toUpperCase();
          const shippingCost = 150.00;
          const grandTotal = order.price + shippingCost;

          printWindow.document.write(
            generateInvoiceHtml({
              formattedOrderId,
              orderDate: order.orderDate,
              title: order.title,
              artisan: order.artisan,
              price: order.price,
              shippingCost,
              grandTotal,
            })
          );
          printWindow.document.close();
          // Give assets a moment to load and print
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

  return (
    <div className="group flex flex-col md:flex-row gap-8 pb-12 border-b border-outline-variant/20 hover:opacity-95 transition-all">
      <div className="w-full md:w-64 h-64 bg-surface-container-low rounded-lg overflow-hidden relative shadow-sm">
        <Image
          src={order.image}
          alt={order.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 font-label-caps text-[10px] tracking-widest font-bold uppercase rounded-full border ${getStatusStyles(order.status)}`}
          >
            {order.status.replace("_", " ")}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-headline-sm text-headline-sm text-primary">
              {order.title}
            </h4>
            <span className="font-headline-sm text-headline-sm text-secondary">
              ₹{order.price.toFixed(2)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-y-4 max-w-sm mt-4">
            <div>
              <p className="font-label-caps text-label-caps text-outline">
                ARTISAN
              </p>
              <p className="font-body-md text-body-md text-on-surface">
                {order.artisan}
              </p>
            </div>
            <div>
              <p className="font-label-caps text-label-caps text-outline">
                ORDER DATE
              </p>
              <p className="font-body-md text-body-md text-on-surface">
                {order.orderDate}
              </p>
            </div>
            {isInTransit && (
              <div>
                <p className="font-label-caps text-label-caps text-outline">
                  EST. ARRIVAL
                </p>
                <p className="font-body-md text-body-md text-on-surface">
                  {order.arrivalDate}
                </p>
              </div>
            )}
            {isDelivered && (
              <div>
                <p className="font-label-caps text-label-caps text-outline">
                  DELIVERED ON
                </p>
                <p className="font-body-md text-body-md text-on-surface">
                  {order.deliveredDate}
                </p>
              </div>
            )}
            {isInTransit && (
              <div>
                <p className="font-label-caps text-label-caps text-outline">
                  TRACKING
                </p>
                <p className="font-body-md text-body-md text-primary underline decoration-primary/30">
                  {order.trackingNumber}
                </p>
              </div>
            )}
            {isDelivered && (
              <div>
                <p className="font-label-caps text-label-caps text-outline">
                  RATING
                </p>
                <div className="flex text-secondary-container">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < (order.rating || 0) ? "currentColor" : "none"}
                      className={
                        i < (order.rating || 0) ? "" : "text-outline/30"
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Button
            href={`/buyer/orders/${order.id}`}
            variant={isInTransit ? "primary" : "outline"}
            className="font-label-caps"
          >
            {isInTransit ? "TRACK ORDER" : "BUY AGAIN"}
          </Button>
          <Button
            onClick={isInTransit ? undefined : handleInvoiceDownload}
            disabled={isDownloading}
            variant="outline"
            className="border-outline-variant/50 font-label-caps text-label-caps min-w-[170px]"
          >
            {isDownloading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5 text-current shrink-0" />
            ) : null}
            {isInTransit ? "MESSAGE ARTISAN" : "DOWNLOAD INVOICE"}
          </Button>
        </div>
      </div>
    </div>
  );
}

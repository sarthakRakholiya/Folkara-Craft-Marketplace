"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { OrderItem } from "../types/order";

import { Button } from "@/components/ui/Button";

interface OrderCardProps {
  order: OrderItem;
}

export function OrderCard({ order }: OrderCardProps) {
  const isDelivered = order.status === "DELIVERED";
  const isInTransit = order.status === "IN_TRANSIT";

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
            className={`px-3 py-1 font-label-caps text-[10px] rounded-full ${
              isInTransit
                ? "bg-primary text-primary-foreground"
                : "bg-surface-container-highest text-on-surface-variant"
            }`}
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

          <div className="flex flex-wrap gap-3 mb-6">
            {order.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-surface-container-high text-primary rounded-full font-label-caps text-[10px]"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-y-4 max-w-sm">
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
            variant="outline"
            className="border-outline-variant/50 font-label-caps text-label-caps"
          >
            {isInTransit ? "MESSAGE ARTISAN" : "DOWNLOAD INVOICE"}
          </Button>
        </div>
      </div>
    </div>
  );
}

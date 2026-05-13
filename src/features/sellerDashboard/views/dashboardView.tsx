import { cn } from "@/lib/utils";
import Image from "next/image";
import { ListingItem, OrderItem } from "../types/dashboard.types";
import {
  Banknote,
  TrendingUp,
  Truck,
  Eye,
  ArrowRight,
  Edit3,
  Sparkles,
  Package,
} from "lucide-react";

const mockListings: ListingItem[] = [
  {
    id: "1",
    title: "Amber Glaze Pitcher",
    price: 124.0,
    stock: 12,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCZyjBFms7uSYsSne-yGEyhAYdqCHraTXx2cHnvtrRXkQkMz2qYb5PEjHQvDJwMA5uX7mY0QqMYwbJ54QJP08Bpl9PvgAQ85YScfAgy0vQEjZYzBizoMFdZyhRQwbUt8KnNwyhoZnBhXRE2jMOaUrXSSIMjwTQgWFtTSHormmzb-xDYnLMjO0NqkfFQuN41h0eXqcoCcISKJ1q9As6bAv70m7jscIw9xgiIdTBRRYXplCQwOHb2-WSHtNV1jmETbiHWYchdznQeDrw",
    tag: { text: "Trending", type: "trending", icon: "auto_awesome" },
    description: "Hand-thrown stoneware • 12 in stock",
  },
  {
    id: "2",
    title: "Indigo Weave Runner",
    price: 85.0,
    stock: 3,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAXjCe3zSqIcySaZ13nk3brQ3Xu4EwnJTONKpD26J2xQkdMzJDUXG6r7UbWwzPUv7mWGieod3OuJ1-NDNtsRCGiZeAEbp78RBx47wB8dgQNCPNMEs-gzCLaXxWExQzxFvAnGKk8ah6fNeZRwgCf2A8KULTO9JjjwpdlF6IJBV-NWJwklM-q_ePesRlOVocgYIO2VcLCpGxQ7b931-frIwnJADcZPzhlz-ifbAaqf5xS5-c3AEdO_Uf7b_PPhVIEvXjL8_KfXclWoWw",
    tag: { text: "Low Stock", type: "low-stock", icon: "inventory_2" },
    description: "Organic cotton textile • 3 in stock",
  },
  {
    id: "3",
    title: "Moss Glaze Bowl",
    price: 42.0,
    stock: 18,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCNWvA8My1SWFcH0fciJTtT4ZlaGIChpcKxQyZcewyXadXqOn81cW3cebsEEH9cCB6xv4pXH_6g5N67ylTurhF1q6Db4EjWT8ZGK9SMOI1jK4kz2c7PZksqkygfAgDlEe89N7bJItS3_k1Gq2zHUKUg_k_LseNWTIN2VRZan9ZFQcdmCOYhgl-KfraqjLT5PUpx-PVNNHgq0ss8XHPNnQtZjSXvyl0pgrQp6ROvFGgGebrbKHHs_EiGQ5ak6MzxV7g9G6jD-C6NnJw",
    description: "Artisanal ceramic • 18 in stock",
  },
];

const mockOrders: OrderItem[] = [
  {
    id: "9482",
    date: "Today, 2:45 PM",
    buyer: {
      name: "Adeline Moore",
      initials: "AM",
      bgColor: "#fed2a9",
      textColor: "#2c1600",
    },
    item: {
      title: "Stone Collection Set",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAtV1s3q9ZJKhrRJJ-34a7n4jVF9VBtJ-p_bPraDiXa7i0acHGe1RYZEBQBPc0_aLes9877XT0HUTRJpXyAplyjI8hjh5Zh-N-iG25e5av26e5OZOPa5Q8OSfKCVJRlG_xZYQTRuINOimMtPEiA-aUsaoYapE_4OTXXLBF_qVkcBXBbMOyY2smohMVNYawRXnxo47AmD1uLCkCmRlBXPVbHnwF2XwMks3at9B_2UweRu0P1MaWHqhpG5Y66c41S0sX6yPm2istrYm4",
    },
    status: "Paid",
    total: 210.0,
  },
  {
    id: "9479",
    date: "Today, 11:20 AM",
    buyer: {
      name: "Julian Weaver",
      initials: "JW",
      bgColor: "#cee9d2",
      textColor: "#092012",
    },
    item: {
      title: "Moss Glaze Bowl",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCNWvA8My1SWFcH0fciJTtT4ZlaGIChpcKxQyZcewyXadXqOn81cW3cebsEEH9cCB6xv4pXH_6g5N67ylTurhF1q6Db4EjWT8ZGK9SMOI1jK4kz2c7PZksqkygfAgDlEe89N7bJItS3_k1Gq2zHUKUg_k_LseNWTIN2VRZan9ZFQcdmCOYhgl-KfraqjLT5PUpx-PVNNHgq0ss8XHPNnQtZjSXvyl0pgrQp6ROvFGgGebrbKHHs_EiGQ5ak6MzxV7g9G6jD-C6NnJw",
    },
    status: "Shipped",
    total: 45.0,
  },
];

export function DashboardView() {
  return (
    <div className="px-4 md:px-margin-page py-8 md:py-16 space-y-16 md:space-y-section-gap max-w-container-max mx-auto">
      {/* Stats Section */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-gutter">
        <div className="lg:col-span-2 bg-primary text-primary-foreground p-8 md:p-12 rounded-[32px] md:rounded-[48px] shadow-sm relative overflow-hidden group min-h-[240px]">
          <div className="absolute -right-4 -top-4 p-8 opacity-10">
            <Banknote size={160} strokeWidth={1} />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <p className="font-label-caps text-xs md:text-sm opacity-80 mb-2">
                Total Revenue
              </p>
              <h3 className="font-display-lg text-4xl md:text-6xl tracking-tight">
                $4,280.00
              </h3>
            </div>
            <div className="flex items-center gap-3 mt-8 md:mt-12">
              <span className="bg-primary-container/10 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold flex items-center gap-1">
                <TrendingUp size={14} strokeWidth={2.5} />
                +12% this month
              </span>
              <div className="flex-1 h-[2px] rounded-full bg-primary-foreground/10"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:col-span-2 gap-gutter">
          <div className="bg-surface-container-low p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-outline-variant/10 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <p className="font-label-caps text-[10px] md:text-xs text-on-surface-variant">
                  Active Orders
                </p>
                <Truck size={20} className="text-on-surface-variant/30" />
              </div>
              <h3 className="font-headline-md text-3xl md:text-4xl">12</h3>
            </div>
            <div className="flex items-end gap-1 h-8 mt-6 opacity-60">
              {[40, 70, 55, 100, 85].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-primary rounded-full"
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-low p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-outline-variant/10 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <p className="font-label-caps text-[10px] md:text-xs text-on-surface-variant">
                  Store Views
                </p>
                <Eye size={20} className="text-on-surface-variant/30" />
              </div>
              <h3 className="font-headline-md text-3xl md:text-4xl">1,842</h3>
            </div>
            <div className="flex items-end gap-1 h-8 mt-6 opacity-60">
              {[30, 60, 80, 45, 70].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-primary rounded-full"
                  style={{ height: `${h}%` }}
                ></div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-low p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-outline-variant/10 shadow-sm sm:col-span-2 flex items-center justify-between">
            <div>
              <p className="font-label-caps text-[10px] md:text-xs text-on-surface-variant mb-1">
                Conversion Rate
              </p>
              <h3 className="font-headline-sm text-xl md:text-2xl">3.8%</h3>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] md:text-xs text-on-surface-variant font-body-md italic hidden sm:block">
                vs. 2.9% industry avg
              </span>
              <div className="flex items-center gap-1">
                <div className="w-24 h-1.5 bg-primary/10 rounded-full overflow-hidden">
                  <div className="w-[38%] h-full bg-primary rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Listings Section */}
      <section>
        <div className="flex justify-between items-end mb-8 md:mb-12">
          <div>
            <h3 className="font-headline-md text-2xl md:text-3xl">
              Top Listings
            </h3>
            <p className="text-on-surface-variant text-xs md:text-sm mt-1">
              Your most popular items this week
            </p>
          </div>
          <button className="font-label-caps text-[10px] md:text-xs text-primary flex items-center gap-2 hover:gap-4 transition-all tracking-widest group">
            VIEW CATALOG
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {mockListings.map((item) => (
            <div
              key={item.id}
              className="bg-surface-container-low rounded-[32px] md:rounded-[40px] border border-outline-variant/10 overflow-hidden shadow-sm hover:shadow-md transition-all group"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {item.tag && (
                  <div className="absolute top-4 left-4">
                    <span
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md",
                        item.tag.type === "trending"
                          ? "bg-primary/80 text-on-primary"
                          : "bg-error/80 text-on-error",
                      )}
                    >
                      {item.tag.icon === "auto_awesome" ? (
                        <Sparkles size={12} strokeWidth={2.5} />
                      ) : (
                        <Package size={12} strokeWidth={2.5} />
                      )}
                      {item.tag.text}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-headline-sm text-lg md:text-xl mb-1">
                      {item.title}
                    </h4>
                    <p className="text-on-surface-variant text-xs md:text-sm">
                      {item.description}
                    </p>
                  </div>
                  <p className="font-display-sm text-xl md:text-2xl text-primary">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-outline-variant/10">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                    <span className="text-[10px] md:text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      {item.stock} in stock
                    </span>
                  </div>
                  <button className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all active:scale-90">
                    <Edit3 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Orders Section */}
      <section>
        <div className="flex justify-between items-end mb-8 md:mb-12">
          <div>
            <h3 className="font-headline-md text-2xl md:text-3xl">
              Recent Orders
            </h3>
            <p className="text-on-surface-variant text-xs md:text-sm mt-1">
              Track and fulfill your latest customer requests
            </p>
          </div>
          <button className="font-label-caps text-[10px] md:text-xs text-primary flex items-center gap-2 hover:gap-4 transition-all tracking-widest group">
            FULFILLMENT CENTER
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>

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
                    ITEMS
                  </th>
                  <th className="px-8 md:px-10 py-6 text-left font-label-caps text-[9px] md:text-[10px] tracking-widest text-on-surface-variant/60">
                    STATUS
                  </th>
                  <th className="px-8 md:px-10 py-6 text-right font-label-caps text-[9px] md:text-[10px] tracking-widest text-on-surface-variant/60">
                    TOTAL
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {mockOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="group hover:bg-surface-container-high/20 transition-colors"
                  >
                    <td className="px-8 md:px-10 py-8">
                      <p className="font-bold text-sm">#{order.id}</p>
                      <p className="text-[10px] md:text-xs text-on-surface-variant/60 mt-1 italic">
                        {order.date}
                      </p>
                    </td>
                    <td className="px-8 md:px-10 py-8">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold"
                          style={{
                            backgroundColor: order.buyer.bgColor,
                            color: order.buyer.textColor,
                          }}
                        >
                          {order.buyer.initials}
                        </div>
                        <p className="text-sm font-medium">
                          {order.buyer.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 md:px-10 py-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden border border-outline-variant/10 shrink-0 relative">
                          <Image
                            src={order.item.image}
                            alt={order.item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="text-xs md:text-sm truncate max-w-[120px]">
                          {order.item.title}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 md:px-10 py-8">
                      <span
                        className={cn(
                          "text-[9px] md:text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full font-bold",
                          order.status === "Paid"
                            ? "bg-secondary-container text-on-secondary-container"
                            : order.status === "Shipped"
                              ? "bg-primary-container/20 text-on-primary-container"
                              : "bg-surface-variant text-on-surface-variant",
                        )}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 md:px-10 py-8 text-right">
                      <p className="font-headline-sm text-base md:text-lg">
                        ${order.total.toFixed(2)}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-8 md:p-10 border-t border-outline-variant/5 text-center">
            <button className="text-primary font-label-caps text-[10px] md:text-xs tracking-widest hover:underline underline-offset-4">
              LOAD MORE ACTIVITY
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

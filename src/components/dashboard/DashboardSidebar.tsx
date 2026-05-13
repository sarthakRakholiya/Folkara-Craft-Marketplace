"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  List, 
  ShoppingBag, 
  MessageSquare, 
  BarChart3, 
  Wallet,
  Library,
  History,
  Sparkles,
  Settings,
  X 
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import { NavItem } from "@/types/navigation";
import { UserMenu } from "@/components/layout/UserMenu";

interface SidebarProps {
  navItems: NavItem[];
  rootHref: string;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  List,
  ShoppingBag,
  MessageSquare,
  BarChart3,
  Wallet,
  Library,
  History,
  Sparkles,
  Settings,
};

export function DashboardSidebar({ navItems, rootHref, isMobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  // Close mobile menu when pathname changes
  useEffect(() => {
    if (isMobileOpen && onMobileClose) {
      onMobileClose();
    }
  }, [pathname]);

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col w-full bg-surface-container-low border-r border-outline-variant/10 shadow-xl transition-transform duration-300 lg:sticky lg:top-0 lg:z-30 lg:translate-x-0 lg:shadow-sm lg:w-72 h-screen",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo Section */}
        <div className="h-24 flex items-center justify-between px-8 shrink-0">
          <Link
            href={rootHref}
            className="flex items-center gap-3 group"
          >
            <div className="w-12 h-12 relative">
              <Image
                src="/logo.png"
                alt="Folkara Logo"
                fill
                className="object-contain"
              />
            </div>
            <div className="h-12 w-24 relative overflow-hidden">
              <Image
                src="/logo-name.png"
                alt="Folkara"
                fill
                className="object-contain"
              />
            </div>
          </Link>
          
          {/* Close button - Mobile only */}
          <button 
            onClick={onMobileClose}
            className="lg:hidden p-2 -mr-2 hover:bg-surface-container-high rounded-full transition-colors"
            aria-label="Close menu"
          >
            <X size={24} className="text-on-surface-variant" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p className="px-4 text-[10px] font-label-caps text-on-surface-variant/50 tracking-widest mb-4">
            MAIN MENU
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = iconMap[item.icon] || LayoutDashboard;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group",
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform group-hover:scale-110 shrink-0",
                    isActive
                      ? "text-white"
                      : "text-on-surface-variant group-hover:text-on-surface",
                  )}
                />
                <span className="font-medium text-sm whitespace-nowrap">
                  {item.title}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 mt-auto">
          <div className="bg-white rounded-2xl p-2 shadow-sm border border-outline-variant/10">
            <UserMenu position="top" showDetails={true} />
          </div>
        </div>
      </aside>
    </>
  );
}

"use client";

import React from "react";
import { useSession } from "@/hooks/useSession";
import { UserMenu } from "@/components/layout/UserMenu";
import { getTimeBasedGreeting } from "./utils";
import { usePathname } from "next/navigation";
import { Bell, Menu } from "lucide-react";

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Get current page title from pathname
  const getPageTitle = () => {
    const parts = pathname.split("/");
    const lastPart = parts[parts.length - 1];
    if (lastPart === "overview") return "Dashboard";
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace("-", " ");
  };

  return (
    <header className="h-20 border-b border-outline-variant/10 bg-surface/80 backdrop-blur-md sticky top-0 z-30 px-6 md:px-10 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-surface-container rounded-lg transition-colors"
        >
          <Menu size={20} className="text-on-surface-variant" />
        </button>
        <div>
          <h2 className="font-headline-sm text-lg text-primary hidden md:block">
            {getTimeBasedGreeting()}, {session?.firstName || "Arthur"}
          </h2>
          <h1 className="font-display-lg text-xl md:hidden">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <button className="p-2.5 hover:bg-surface-container rounded-full transition-colors relative group">
          <Bell size={20} className="text-on-surface-variant group-hover:text-primary transition-colors" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-secondary rounded-full border-2 border-surface" />
        </button>
        
        <div className="h-8 w-[1px] bg-outline-variant/20 hidden md:block" />
        
        <UserMenu />
      </div>
    </header>
  );
}

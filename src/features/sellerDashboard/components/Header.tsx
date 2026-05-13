"use client";

import { UserMenu } from "@/components/layout/user-menu";
import { getTimeBasedGreeting } from "../utils";
import { usePathname } from "next/navigation";
import { Bell, Menu } from "lucide-react";

interface HeaderProps {
  user: {
    firstName?: string | null;
    lastName?: string | null;
    avatarUrl?: string | null;
    shopName?: string | null;
  };
  onMenuClick?: () => void;
}

export function Header({ user, onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const greeting = getTimeBasedGreeting();

  // Determine title based on path
  const getTitle = () => {
    if (pathname.includes("/listings")) return "Listings";
    if (pathname.includes("/orders")) return "Orders";
    if (pathname.includes("/messages")) return "Messages";
    if (pathname.includes("/analytics")) return "Analytics";
    if (pathname.includes("/payouts")) return "Payouts";
    return "Overview";
  };

  const title = getTitle();

  return (
    <header className="flex justify-between items-center w-full px-4 md:px-margin-page py-4 sticky top-0 bg-surface/80 backdrop-blur-md dark:bg-surface-dim border-b border-outline-variant/20 z-40">
      <div className="flex items-center gap-4">
        {/* Burger Menu for mobile */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-surface-variant/50 rounded-full transition-colors border border-outline-variant/10"
          aria-label="Open menu"
        >
          <Menu size={20} className="text-on-surface-variant" />
        </button>

        <div className="flex flex-col">
          <h2 className="font-headline-md text-headline-sm md:text-headline-md text-primary leading-tight">
            {title}
          </h2>
          {title === "Overview" && (
            <p className="hidden md:block text-on-surface-variant text-xs mt-1 font-body-md italic opacity-70">
              {greeting}, {user.firstName}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <div className="flex items-center gap-3 md:gap-4 text-on-surface-variant">
          <button className="w-10 h-10 flex items-center justify-center hover:bg-surface-variant/50 rounded-full transition-colors border border-outline-variant/10">
            <Bell size={20} className="text-on-surface-variant" />
          </button>

          <UserMenu user={user} position="bottom" />
        </div>
      </div>
    </header>
  );
}

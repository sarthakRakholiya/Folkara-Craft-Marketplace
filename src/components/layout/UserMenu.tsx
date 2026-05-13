"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { logout } from "@/features/auth/actions/auth.actions";
import { getInitials, cn } from "@/lib/utils";
import { useSession } from "@/hooks/useSession";

interface UserMenuProps {
  position?: "top" | "bottom";
  showDetails?: boolean;
}

export function UserMenu({
  position = "bottom",
  showDetails = false,
}: UserMenuProps) {
  const { data: session, isLoading } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      gsap.fromTo(
        dropdownRef.current,
        { opacity: 0, y: position === "bottom" ? -10 : 10, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: "power2.out" },
      );
    }
  }, [isOpen, position]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading || !session) {
    return (
      <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-surface-variant/20 animate-pulse" />
    );
  }

  const initials = getInitials(session.firstName, session.lastName);
  const isSeller = session.role?.toUpperCase() === "SELLER";
  const baseUrl = isSeller ? "/seller" : "/buyer";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1 rounded-full hover:bg-surface-variant/30 transition-all duration-300 active:scale-95"
      >
        <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden border border-outline-variant/30 relative bg-primary/10 flex items-center justify-center shrink-0">
          {session.avatarUrl ? (
            <Image
              alt="User profile"
              src={session.avatarUrl}
              fill
              className="object-cover"
            />
          ) : (
            <span className="text-primary font-bold text-sm">{initials}</span>
          )}
        </div>
        {showDetails && (
          <div className="text-left pr-2">
            <p className="font-body-md text-sm font-bold truncate max-w-[120px]">
              {session.firstName}
            </p>
            {isSeller && session.shopName && (
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                {session.shopName}
              </p>
            )}
          </div>
        )}
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className={cn(
            "absolute right-0 w-60 bg-surface-container-high rounded-2xl shadow-2xl border border-outline-variant/20 z-[60] overflow-hidden",
            position === "bottom" ? "top-full mt-2" : "bottom-full mb-2",
          )}
        >
          <div className="p-4 border-b border-outline-variant/10 bg-surface-container flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/30 relative bg-primary/10 flex items-center justify-center shrink-0">
              {session.avatarUrl ? (
                <Image
                  alt="User profile"
                  src={session.avatarUrl}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="text-primary font-bold text-xs">
                  {initials}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate">
                {session.firstName} {session.lastName}
              </p>
              {isSeller && session.shopName ? (
                <p className="text-xs text-on-surface-variant truncate font-medium">
                  {session.shopName}
                </p>
              ) : (
                <p className="text-xs text-on-surface-variant truncate font-medium uppercase tracking-tighter">
                  {session.role}
                </p>
              )}
            </div>
          </div>
          <div className="p-2 space-y-1">
            <Link
              href={`${baseUrl}/overview`}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-primary/10 hover:text-primary transition-all duration-200 group cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg transition-transform group-hover:scale-120 group-hover:-rotate-12">
                dashboard
              </span>
              {isSeller ? "Dashboard" : "My Account"}
            </Link>
            <Link
              href={`${baseUrl}/profile`}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-primary/10 hover:text-primary transition-all duration-200 group cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg transition-transform group-hover:scale-120 group-hover:-rotate-12">
                person
              </span>
              My Profile
            </Link>
            <Link
              href={`${baseUrl}/settings`}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-primary/10 hover:text-primary transition-all duration-200 group cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg transition-transform group-hover:rotate-12">
                settings
              </span>
              Settings
            </Link>
          </div>
          <div className="p-2 border-t border-outline-variant/10">
            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-error hover:bg-error/10 transition-all duration-200 group cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">
                logout
              </span>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

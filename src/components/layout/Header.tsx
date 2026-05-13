"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MobileNav } from "./MobileNav";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { UserMenu } from "./user-menu";

interface HeaderProps {
  isAuthenticated?: boolean;
  userRole?: string;
  user?: {
    firstName?: string | null;
    lastName?: string | null;
    avatarUrl?: string | null;
    shopName?: string | null;
  };
}

export function Header({ isAuthenticated = false, userRole, user }: HeaderProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Explore crafts", href: "/explore" },
    { name: "Browse by craft", href: "/browse" },
    { name: "Our Story", href: "/story" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-surface/80 backdrop-blur-md shadow-sm border-b border-outline-variant/20">
        <div className="flex lg:grid lg:grid-cols-[1fr_auto_1fr] items-center justify-between w-full px-4 md:px-margin-page py-unit max-w-container-max mx-auto">
          {/* Left: Logo Area */}
          <div className="flex items-center">
            <Link
              href="/"
              aria-label="Folkara Home"
              className="flex items-center gap-2 group"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="Folkara Icon"
                  width={200}
                  height={200}
                  className="h-10 md:h-12 w-auto object-contain"
                  priority
                />
                <Image
                  src="/logo-name.png"
                  alt="Folkara Name"
                  width={500}
                  height={100}
                  className="hidden sm:block h-5 md:h-6 w-auto object-contain -ml-1"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Center: Navigation */}
          <nav className="hidden lg:flex gap-10 items-center justify-center">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href ||
                    pathname?.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "draw-underline text-on-surface-variant font-sans text-base transition-colors duration-300 hover:text-primary whitespace-nowrap cursor-pointer",
                    isActive && "active text-primary font-bold",
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center justify-end gap-2">
            {isAuthenticated && user ? (
              <div className="hidden lg:flex items-center gap-4 mr-2">
                <Link href="/cart" aria-label="Cart">
                  <span
                    className="material-symbols-outlined text-primary cursor-pointer hover:text-secondary transition-colors text-[20px]"
                    data-icon="shopping_bag"
                  >
                    shopping_bag
                  </span>
                </Link>
                <UserMenu user={user} role={userRole} position="bottom" />
              </div>
            ) : (
              <Button
                variant="primary"
                size="md"
                className="hidden lg:flex"
                href="/auth"
              >
                Join the Circle
              </Button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-surface-container-high rounded-full transition-colors cursor-pointer"
              aria-label="Open Menu"
            >
              <Menu size={24} className="text-on-surface-variant" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Sidebar */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navLinks={navLinks}
        isAuthenticated={isAuthenticated}
        userRole={userRole}
      />
    </>
  );
}

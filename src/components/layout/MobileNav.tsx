"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useSession } from "@/hooks/useSession";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: Array<{ name: string; href: string }>;
}

export function MobileNav({ isOpen, onClose, navLinks }: MobileNavProps) {
  const { data: session } = useSession();
  const isAuthenticated = !!session;
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Lock body scroll
      document.body.style.overflow = "hidden";

      const tl = gsap.timeline();

      tl.to(overlayRef.current, {
        opacity: 1,
        visibility: "visible",
        duration: 0.3,
        ease: "power2.out",
      })
        .to(
          menuRef.current,
          {
            x: 0,
            duration: 0.5,
            ease: "power3.out",
          },
          "-=0.2",
        )
        .fromTo(
          ".mobile-nav-link",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out" },
          "-=0.3",
        );
    } else {
      // Unlock body scroll
      document.body.style.overflow = "";

      const tl = gsap.timeline();

      tl.to(menuRef.current, {
        x: "100%",
        duration: 0.4,
        ease: "power3.in",
      }).to(
        overlayRef.current,
        {
          opacity: 0,
          visibility: "hidden",
          duration: 0.3,
          ease: "power2.in",
        },
        "-=0.2",
      );
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Background Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[60] invisible opacity-0"
        onClick={onClose}
      />

      {/* Sidebar Menu */}
      <div
        ref={menuRef}
        className="fixed top-0 right-0 bottom-0 w-full sm:w-[400px] bg-surface z-[70] shadow-2xl translate-x-full overflow-y-auto paper-texture"
      >
        <div className="flex flex-col h-full p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <Image src="/logo.png" alt="Folkara Icon" width={200} height={200} className="h-10 w-auto object-contain" />
            </Link>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-container-high rounded-full transition-colors cursor-pointer"
              aria-label="Close Menu"
            >
              <X size={24} className="text-on-surface-variant" />
            </button>
          </div>

          {/* Links */}
          <nav className="flex flex-col gap-6" ref={linksRef}>
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
                  onClick={onClose}
                  className={cn(
                    "mobile-nav-link text-2xl font-serif text-on-surface hover:text-primary transition-colors py-2 border-b border-outline-variant/10",
                    isActive && "text-primary font-bold",
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer / CTA */}
          <div className="mt-auto pt-12 space-y-6 mobile-nav-link">
            {isAuthenticated ? (
              <div className="flex flex-col gap-4">
                <Link
                  href={`/${session?.role?.toLowerCase()}/overview`}
                  onClick={onClose}
                  className="flex items-center gap-3 text-lg font-serif text-on-surface hover:text-primary transition-colors py-3 border-b border-outline-variant/10"
                >
                  <span className="material-symbols-outlined text-primary text-[24px]" data-icon="person">person</span>
                  My Dashboard
                </Link>
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="flex items-center gap-3 text-lg font-serif text-on-surface hover:text-primary transition-colors py-3 border-b border-outline-variant/10"
                >
                  <span className="material-symbols-outlined text-primary text-[24px]" data-icon="shopping_bag">shopping_bag</span>
                  Shopping Cart
                </Link>
              </div>
            ) : (
              <Button
                variant="primary"
                size="lg"
                className="w-full rounded-full py-6"
                href="/auth"
                onClick={onClose}
              >
                Join the Circle
              </Button>
            )}
            <div className="text-center">
              <p className="text-xs text-on-surface-variant uppercase tracking-widest font-semibold">
                © 2026 Folkara
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

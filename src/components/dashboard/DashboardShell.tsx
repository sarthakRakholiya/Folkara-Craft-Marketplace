"use client";

import { useState } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { NavItem } from "@/types/navigation";

interface DashboardShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
  rootHref: string;
}

export function DashboardShell({ children, navItems, rootHref }: DashboardShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-on-surface font-body-md">
      {/* Sidebar - Desktop and Mobile Drawer */}
      <DashboardSidebar 
        navItems={navItems}
        rootHref={rootHref}
        isMobileOpen={isMobileMenuOpen} 
        onMobileClose={() => setIsMobileMenuOpen(false)} 
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <DashboardHeader 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
        />
        <div className="flex-1 overflow-y-auto custom-scrollbar pb-6 lg:pb-0">
          {children}
        </div>
      </main>
      
      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

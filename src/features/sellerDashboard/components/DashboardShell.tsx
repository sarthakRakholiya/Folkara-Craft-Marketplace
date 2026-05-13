"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface DashboardShellProps {
  children: React.ReactNode;
  user: {
    firstName?: string | null;
    lastName?: string | null;
    avatarUrl?: string | null;
    shopName?: string | null;
  };
}

export function DashboardShell({ children, user }: DashboardShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-on-surface font-body-md">
      {/* Sidebar - Desktop and Mobile Drawer */}
      <Sidebar 
        isMobileOpen={isMobileMenuOpen} 
        onMobileClose={() => setIsMobileMenuOpen(false)} 
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <Header 
          user={user} 
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

import type { Metadata } from "next";
import { Noto_Serif, Manrope } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Folkara | Artisan Marketplace",
  description:
    "Discover curated handmade goods from master artisans. Experience the beauty of unhurried discovery.",
  icons: {
    icon: "/favicon.png",
  },
};

import { QueryProvider } from "@/providers/QueryProvider";
import { AiAssistantSidebar } from "@/features/aiAssistant/components/AiAssistantSidebar";

import { Toaster } from 'sonner';

import { Suspense } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${notoSerif.variable} ${manrope.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head suppressHydrationWarning>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-surface text-on-surface">
        <QueryProvider>
          <Suspense fallback={null}>
            <NuqsAdapter>
              {children}
              <AiAssistantSidebar />
              <Toaster richColors position="top-center" closeButton />
            </NuqsAdapter>
          </Suspense>
        </QueryProvider>
      </body>
    </html>
  );
}

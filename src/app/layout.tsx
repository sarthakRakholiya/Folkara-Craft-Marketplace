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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://folkara.vercel.app",
  ),
  title: "Folkara | Artisan Marketplace",
  description:
    "Discover curated handmade goods from master artisans. Experience the beauty of unhurried discovery.",
  keywords: [
    "handmade",
    "artisan",
    "craft",
    "marketplace",
    "slow-made",
    "folkara",
    "handcrafted",
    "authentic",
    "pottery",
    "ceramics",
    "woodworking",
    "textiles",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Folkara",
    title: "Folkara | Artisan Marketplace",
    description:
      "Discover curated handmade goods from master artisans. Experience the beauty of unhurried discovery.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Folkara - Slow-Made Craft Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Folkara | Artisan Marketplace",
    description:
      "Discover curated handmade goods from master artisans. Experience the beauty of unhurried discovery.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.png",
  },
};

import { QueryProvider } from "@/providers/QueryProvider";
import { NavigationProgress } from "@/components/layout/NavigationProgress";
import { AiAssistantSidebar } from "@/features/aiAssistant/components/AiAssistantSidebar";
import { Toaster } from "sonner";
import { Suspense } from "react";

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
              <NavigationProgress />
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

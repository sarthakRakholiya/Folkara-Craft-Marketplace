"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";

NProgress.configure({
  showSpinner: false,
  speed: 350,
  minimum: 0.1,
  trickleSpeed: 200,
});

export function NavigationProgress() {
  const pathname = usePathname();
  const prevPathname = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isNavigatingRef = useRef(false);

  // Detect route change completion
  useEffect(() => {
    if (prevPathname.current === null) {
      // First render — just record the pathname, don't do anything
      prevPathname.current = pathname;
      return;
    }

    if (prevPathname.current !== pathname) {
      // Route changed — clear any pending timers and complete the bar
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      isNavigatingRef.current = false;
      prevPathname.current = pathname;
      NProgress.done();
    }
  }, [pathname]);

  // Intercept link clicks to start progress bar
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Ignore clicks that originate inside button elements (such as save/bookmark toggles)
      if ((e.target as HTMLElement).closest("button")) return;

      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Skip non-navigational links
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("javascript:") ||
        anchor.getAttribute("target") === "_blank" ||
        anchor.getAttribute("download") != null
      ) return;

      // Skip if navigating to the same page
      const currentPath = window.location.pathname;
      const targetPath = href.startsWith("/") ? href.split("?")[0] : null;
      if (targetPath && targetPath === currentPath) return;

      // Clear any previous timer and start fresh
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      isNavigatingRef.current = true;
      NProgress.start();

      // Gradually advance the bar but ONLY if we're still navigating
      timerRef.current = setTimeout(() => {
        if (isNavigatingRef.current) {
          NProgress.set(0.5);
        }
      }, 400);
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return null;
}

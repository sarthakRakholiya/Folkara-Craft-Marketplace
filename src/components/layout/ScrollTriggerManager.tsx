"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Safely register ScrollTrigger on client side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ScrollTriggerManager() {
  const pathname = usePathname();

  useEffect(() => {
    // Wrap operations inside a gsap.context to make cleanup/reversion perfect
    const ctx = gsap.context(() => {
      // Clear any existing ScrollTriggers on re-render/navigation
      ScrollTrigger.getAll().forEach((t) => t.kill());

      // 1. Simple fade-up animation
      const fadeUpElements = gsap.utils.toArray(".gsap-fade-up") as HTMLElement[];
      fadeUpElements.forEach((el) => {
        // Set initial state
        gsap.set(el, { opacity: 0, y: 40 });

        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // 2. Simple fade-in animation
      const fadeInElements = gsap.utils.toArray(".gsap-fade-in") as HTMLElement[];
      fadeInElements.forEach((el) => {
        // Set initial state
        gsap.set(el, { opacity: 0 });

        gsap.to(el, {
          opacity: 1,
          duration: 0.8,
          ease: "power1.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // 3. Slide in from right (emerging to left)
      const slideLeftElements = gsap.utils.toArray(".gsap-slide-left") as HTMLElement[];
      slideLeftElements.forEach((el) => {
        // Set initial state
        gsap.set(el, { opacity: 0, x: 60 });

        gsap.to(el, {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // 4. Slide in from left (emerging to right)
      const slideRightElements = gsap.utils.toArray(".gsap-slide-right") as HTMLElement[];
      slideRightElements.forEach((el) => {
        // Set initial state
        gsap.set(el, { opacity: 0, x: -60 });

        gsap.to(el, {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // 5. Scale up/Zoom in
      const scaleUpElements = gsap.utils.toArray(".gsap-scale-up") as HTMLElement[];
      scaleUpElements.forEach((el) => {
        // Set initial state
        gsap.set(el, { opacity: 0, scale: 0.96 });

        gsap.to(el, {
          opacity: 1,
          scale: 1,
          duration: 1.0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // 6. Stagger containers and their stagger-items
      const staggerContainers = gsap.utils.toArray(".gsap-stagger") as HTMLElement[];
      staggerContainers.forEach((container) => {
        const items = container.querySelectorAll(".gsap-stagger-item");
        if (items.length > 0) {
          // Set initial state on all items inside the container
          gsap.set(items, { opacity: 0, y: 30 });

          gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: container,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          });
        }
      });
    });

    // Refresh ScrollTrigger to recalculate viewport coordinates
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      ctx.revert();
    };
  }, [pathname]); // Re-run whenever the user navigates routes

  return null;
}

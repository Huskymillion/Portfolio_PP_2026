"use client";

import { useEffect } from "react";
import { useLenis } from "./SmoothScrollProvider";

/**
 * Reads window.location.hash on mount and smooth-scrolls to the matching
 * element via Lenis. Enables direct links like huskymillion.com/#case-03b.
 */
export function HashScroll() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const hash = window.location.hash;
    if (!hash) return;
    const el = document.querySelector(hash);
    if (!el) return;
    // Wait for layout to settle (fonts, images, sticky sections)
    const t = setTimeout(() => {
      lenis.scrollTo(el as HTMLElement, { duration: 1.4 });
    }, 600);
    return () => clearTimeout(t);
  }, [lenis]);

  return null;
}

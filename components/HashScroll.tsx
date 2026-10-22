"use client";

import { useEffect } from "react";
import { useLenis } from "./SmoothScrollProvider";

/**
 * Reads window.location.hash on mount and smooth-scrolls to the matching
 * element via Lenis. Enables direct links like huskymillion.com/#case-riders-rights.
 */

// Old numeric anchors (may still be in sent applications) → slug anchors.
// 04 = sfv, 07 = kfh are unpublished → jump to the work section.
const LEGACY_HASH: Record<string, string> = {
  "#case-01": "#case-kottur", "#case-02": "#case-freundliche-gruesse", "#case-03": "#case-ewz",
  "#case-03b": "#case-riders-rights", "#case-05": "#case-schweizer-paraplegiker-stiftung",
  "#case-06": "#case-kapo-bern", "#case-08": "#case-mawave", "#case-09": "#case-personal",
  "#case-04": "#work", "#case-07": "#work",
};

export function HashScroll() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const raw = window.location.hash;
    if (!raw) return;
    const hash = LEGACY_HASH[raw] ?? raw;
    if (hash !== raw) {
      history.replaceState(null, "", `${window.location.pathname}${window.location.search}${hash}`);
    }
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

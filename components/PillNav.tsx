"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Zap } from "lucide-react";
import { useLenis } from "./SmoothScrollProvider";

const ITEMS = [
  { label: "work", target: "#work" },
  { icon: true, target: "#hero" },
  { label: "contact", target: "#contact" },
];

export function PillNav() {
  const lenis = useLenis();
  const { scrollY } = useScroll();
  const [vh, setVh] = useState(800);

  useEffect(() => {
    setVh(window.innerHeight);
  }, []);

  /*
   * Hero wrapper = 200vh. Split animates at scrollYProgress [0.3 → 0.85]
   * → absolute: 60vh → 170vh.
   * Nav fades out just before the split, fades back in once split is done.
   */
  const opacity = useTransform(
    scrollY,
    [vh * 0.5, vh * 0.75, vh * 1.7, vh * 2.0],
    [1,         0,          0,        1],
  );
  const pointerEvents = useTransform(opacity, (v) => (v < 0.05 ? "none" : "auto"));

  function scrollTo(target: string) {
    if (lenis) {
      lenis.scrollTo(target === "#hero" ? 0 : target, { duration: 1.4 });
    } else {
      if (target === "#hero") window.scrollTo({ top: 0, behavior: "smooth" });
      else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <motion.nav
      style={{
        opacity,
        pointerEvents,
        position: "fixed",
        bottom: "clamp(1.25rem, 3vh, 2rem)",
        left: "50%",
        x: "-50%",
        zIndex: 100,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0",
          background: "#fafafa",
          borderRadius: "9999px",
          padding: "0.65rem 0.25rem",
          boxShadow: "0 2px 20px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
          userSelect: "none",
        }}
      >
        {ITEMS.map((item, i) => (
          <button
            key={i}
            onClick={() => scrollTo(item.target)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: item.icon ? "0.4rem 1rem" : "0.4rem 1.4rem",
              background: "none",
              border: "none",
              cursor: "pointer",
              borderRight: i < ITEMS.length - 1 ? "1px solid rgba(0,0,0,0.12)" : "none",
              color: "#0a0a0a",
              fontFamily: "var(--font-sans)",
              fontSize: "0.75rem",
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "lowercase",
              lineHeight: 1,
              transition: "opacity 150ms ease",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.45")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          >
            {item.icon ? <Zap size={13} strokeWidth={2.5} /> : item.label}
          </button>
        ))}
      </div>
    </motion.nav>
  );
}

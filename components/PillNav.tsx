"use client";

import { useEffect, useRef, useState } from "react";
import { m, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Zap } from "lucide-react";
import { useLenis } from "./SmoothScrollProvider";

/* ─── Shared ──────────────────────────────────────────── */

const FONT_BRIER = "'Brier', 'Arial Black', Impact, sans-serif";
const FONT_MONA  = "'Mona Sans', 'Inter', 'Helvetica Neue', Arial, sans-serif";

const NAV_LINKS = [
  { label: "work",    target: "#work"    },
  { label: "contact", target: "#contact" },
];

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

/* ─── Mobile hamburger + overlay ─────────────────────── */

function MobileNav() {
  const lenis    = useLenis();
  const [open, setOpen] = useState(false);

  /* Stop / resume Lenis while menu is open so the page can't scroll behind it */
  useEffect(() => {
    if (open) lenis?.stop();
    else      lenis?.start();
    return () => { lenis?.start(); };
  }, [open, lenis]);

  function scrollTo(target: string) {
    setOpen(false);
    /* Short delay so menu animates out before the scroll begins */
    setTimeout(() => {
      if (lenis) lenis.scrollTo(target, { duration: 1.4 });
      else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    }, 260);
  }

  return (
    <>
      {/* ── Hamburger / close button — always visible top-right ── */}
      <button
        aria-label={open ? "Close navigation" : "Open navigation"}
        onClick={() => setOpen(v => !v)}
        style={{
          position:              "fixed",
          top:                   "1rem",
          right:                 "1rem",
          zIndex:                400,
          width:                 44,
          height:                44,
          background:            "rgba(10,10,10,0.6)",
          backdropFilter:        "blur(10px)",
          WebkitBackdropFilter:  "blur(10px)",
          border:                "1px solid rgba(255,255,255,0.1)",
          borderRadius:          "50%",
          display:               "flex",
          alignItems:            "center",
          justifyContent:        "center",
          cursor:                "pointer",
          touchAction:           "manipulation",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <m.svg
              key="close"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
              transition={{ duration: 0.18 }}
              width="14" height="14" viewBox="0 0 14 14" fill="none"
            >
              <line x1="1" y1="1"  x2="13" y2="13" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              <line x1="13" y1="1" x2="1"  y2="13" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </m.svg>
          ) : (
            <m.svg
              key="burger"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              width="17" height="12" viewBox="0 0 17 12" fill="none"
            >
              <line x1="0" y1="1"   x2="17" y2="1"   stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
              <line x1="0" y1="6"   x2="17" y2="6"   stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
              <line x1="0" y1="11"  x2="17" y2="11"  stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
            </m.svg>
          )}
        </AnimatePresence>
      </button>

      {/* ── Full-screen overlay nav ── */}
      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{
              position:      "fixed",
              inset:         0,
              background:    "#0a0a0a",
              zIndex:        350,
              display:       "flex",
              flexDirection: "column",
              justifyContent:"center",
              padding:       "2rem 2.5rem",
            }}
          >
            {/* Nav links — large Brier stagger */}
            <nav>
              {NAV_LINKS.map((link, i) => (
                <m.div
                  key={link.target}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.32, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                >
                  <button
                    onClick={() => scrollTo(link.target)}
                    style={{
                      display:       "block",
                      background:    "none",
                      border:        "none",
                      fontFamily:    FONT_BRIER,
                      fontSize:      "clamp(3rem, 16vw, 5.5rem)",
                      fontWeight:    900,
                      letterSpacing: "-0.03em",
                      textTransform: "uppercase",
                      color:         "#fafafa",
                      textAlign:     "left",
                      cursor:        "pointer",
                      padding:       "0.1em 0",
                      lineHeight:    1,
                      touchAction:   "manipulation",
                      width:         "100%",
                    }}
                    onPointerEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "#E0115F";
                    }}
                    onPointerLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "#fafafa";
                    }}
                  >
                    {link.label}
                  </button>
                </m.div>
              ))}
            </nav>

            {/* Divider */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", margin: "2.5rem 0 1.5rem" }} />

            {/* Footer meta */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <span style={{
                fontFamily:    FONT_MONA,
                fontSize:      "0.6rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color:         "rgba(255,255,255,0.25)",
              }}>
                pascal pfohl
              </span>
              <span style={{
                fontFamily:    FONT_MONA,
                fontSize:      "0.6rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color:         "rgba(255,255,255,0.25)",
              }}>
                © {new Date().getFullYear()}
              </span>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Desktop pill nav — identical to original ────────── */

const DESKTOP_ITEMS = [
  { label: "work",    target: "#work",    icon: false },
  { label: undefined, target: "#hero",    icon: true  },
  { label: "contact", target: "#contact", icon: false },
];

function DesktopNav() {
  const lenis       = useLenis();
  const { scrollY } = useScroll();
  const [vh, setVh] = useState(800);
  const lastTap     = useRef(0);

  useEffect(() => { setVh(window.innerHeight); }, []);

  const opacity = useTransform(
    scrollY,
    [vh * 0.5, vh * 0.75, vh * 1.7, vh * 2.0],
    [1,         0,          0,         1],
  );
  const pointerEvents = useTransform(opacity, (v) => (v < 0.05 ? "none" : "auto"));

  function scrollTo(target: string) {
    if (target === "#hero") {
      const now = Date.now();
      if (now - lastTap.current < 300) return;
      lastTap.current = now;
    }
    if (lenis) {
      lenis.scrollTo(target === "#hero" ? 0 : target, { duration: 1.4 });
    } else {
      if (target === "#hero") window.scrollTo({ top: 0, behavior: "smooth" });
      else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <m.nav
      style={{
        opacity,
        pointerEvents,
        position: "fixed",
        bottom:   "clamp(1.25rem, 3vh, 2rem)",
        left:     "50%",
        x:        "-50%",
        zIndex:   100,
      }}
    >
      <div
        style={{
          display:      "flex",
          alignItems:   "center",
          gap:          "0",
          background:   "#fafafa",
          borderRadius: "9999px",
          padding:      "0.65rem 0.25rem",
          boxShadow:    "0 2px 20px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
          userSelect:   "none",
        }}
      >
        {DESKTOP_ITEMS.map((item, i) => (
          <button
            key={i}
            aria-label={item.label ?? "Back to top"}
            onClick={() => scrollTo(item.target)}
            style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              padding:        item.icon ? "0.4rem 1rem" : "0.4rem 1.4rem",
              background:     "none",
              border:         "none",
              cursor:         "pointer",
              borderRight:    i < DESKTOP_ITEMS.length - 1 ? "1px solid rgba(0,0,0,0.12)" : "none",
              color:          "#0a0a0a",
              fontFamily:     "var(--font-sans)",
              fontSize:       "0.75rem",
              fontWeight:     500,
              letterSpacing:  "0.06em",
              textTransform:  "lowercase",
              lineHeight:     1,
              transition:     "opacity 150ms ease",
              touchAction:    "manipulation",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.45")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          >
            {item.icon ? <Zap size={13} strokeWidth={2.5} /> : item.label}
          </button>
        ))}
      </div>
    </m.nav>
  );
}

/* ─── Root export — branches on viewport width ────────── */

export function PillNav() {
  const isMobile = useIsMobile();

  /*
   * Delay render until after hydration so isMobile is accurate.
   * Without this, SSR renders the desktop nav on mobile (or vice versa)
   * and React logs a hydration mismatch.
   */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return isMobile ? <MobileNav /> : <DesktopNav />;
}

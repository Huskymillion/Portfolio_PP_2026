"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ScrambleText } from "@/components/ScrambleText";

/* ─── Copy ─────────────────────────────────────── */

const LEFT_WORDS  = ["video", "social video", "motion", "motion graphics", "creative content", "creative content producer"];
const RIGHT_WORDS = ["homebase", "züri", "start of the creative journey", "munich", "studies abroad", "sweden", "born&raised", "allgäu"];

const FONT_BRIER = "'Brier', 'Arial Black', Impact, sans-serif";

/* ─── Title position (measured once after fonts load) */

interface TitlePos {
  titleLeft:   number;  // px from viewport-left  = left edge of title (= left of "S" in SERVUS)
  titleRight:  number;  // px from viewport-right  = right edge of title (= right of last char)
  titleTop:    number;  // px from sticky-top      = top of title block
  helloBottom: number;  // px from sticky-top      = bottom of +HELLO
  ready:       boolean;
}

const DEFAULT_POS: TitlePos = { titleLeft: -1, titleRight: -1, titleTop: -1, helloBottom: -1, ready: false };

/* ─── Cycling scramble controller ───────────────── */

const WORD_STEP  = 350;  // ms between each word being revealed
const HOLD_ALL   = 2200; // ms to hold all words revealed before reset
const RESET_GAP  = 600;  // ms gap after reset before next cycle

/* ─── Hero inner layout ─────────────────────────── */

interface HeroInnerProps {
  revealedUpTo: number;
  pos:          TitlePos;
  titleRef?:    React.RefObject<HTMLDivElement | null>;
  servusRef?:   React.RefObject<HTMLParagraphElement | null>;
  helloRef?:    React.RefObject<HTMLParagraphElement | null>;
  wrapperRef:   React.RefObject<HTMLDivElement | null>;
}

function HeroInner({ revealedUpTo, pos, titleRef, servusRef, helloRef, wrapperRef }: HeroInnerProps) {
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const vw = typeof window !== "undefined" ? window.innerWidth  : 1280;

  /*
   * Left column:  right edge touches left of "S" in SERVUS,  top at title top.
   * Right column: left edge touches right of title,           bottom at bottom of +HELLO.
   * Columns sit OUTSIDE the title — no overlap.
   */
  const leftStyle: React.CSSProperties = pos.ready
    ? { position: "absolute", right: vw - pos.titleLeft + 16, top: pos.titleTop, display: "flex", flexDirection: "column", textAlign: "right" }
    : { position: "absolute", left: "clamp(1.5rem, 4vw, 5rem)", top: "clamp(2rem, 6vh, 5rem)", display: "flex", flexDirection: "column", textAlign: "right" };

  const rightStyle: React.CSSProperties = pos.ready
    ? { position: "absolute", left: pos.titleRight + 16, bottom: vh - pos.helloBottom, display: "flex", flexDirection: "column-reverse", textAlign: "left" }
    : { position: "absolute", right: "clamp(1.5rem, 4vw, 5rem)", bottom: "clamp(2rem, 6vh, 5rem)", display: "flex", flexDirection: "column-reverse", textAlign: "left" };

  const colStyle: React.CSSProperties = {
    fontFamily:    "var(--font-mono)",
    fontSize:      "clamp(0.55rem, 0.85vw, 0.72rem)",
    lineHeight:    2,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "#000", color: "#fff", overflow: "hidden" }}>

      {/* Left column — top-anchored, words reveal top → down */}
      <div style={{ ...leftStyle, ...colStyle }}>
        {LEFT_WORDS.map((w, i) => (
          <ScrambleText key={w} text={w} isActive={i <= revealedUpTo} />
        ))}
      </div>

      {/* Right column — bottom-anchored, words grow upward (column-reverse) */}
      <div style={{ ...rightStyle, ...colStyle }}>
        {RIGHT_WORDS.map((w, i) => (
          <ScrambleText key={w} text={w} isActive={i <= revealedUpTo} />
        ))}
      </div>

      {/* Main title */}
      <div
        ref={titleRef}
        style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -54%)", textAlign: "center", whiteSpace: "nowrap", pointerEvents: "none" }}
      >
        <p ref={servusRef} style={{ fontFamily: FONT_BRIER, fontSize: "clamp(4.5rem, 13.5vw, 15rem)", fontWeight: 900, lineHeight: 0.88, letterSpacing: "-0.025em", color: "#fff", textTransform: "uppercase", margin: 0 }}>
          SERVUS
        </p>
        <p ref={helloRef} style={{ fontFamily: FONT_BRIER, fontSize: "clamp(4.5rem, 13.5vw, 15rem)", fontWeight: 900, lineHeight: 0.88, letterSpacing: "-0.025em", color: "#fff", textTransform: "uppercase", margin: 0, marginTop: "0.06em" }}>
          +HELLO
        </p>
      </div>

    </div>
  );
}

/* ─── Hero section ─────────────────────────────── */

export function Hero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const titleRef   = useRef<HTMLDivElement>(null);
  const servusRef  = useRef<HTMLParagraphElement>(null);
  const helloRef   = useRef<HTMLParagraphElement>(null);

  const [pos, setPos]             = useState<TitlePos>(DEFAULT_POS);
  const [revealedUpTo, setRevealed] = useState(-1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Measure title bounds relative to the sticky container (scrollY=0 → container.top=0) */
  useEffect(() => {
    const measure = () => {
      if (!titleRef.current || !servusRef.current || !helloRef.current || !wrapperRef.current) return;
      // Ensure we measure at scrollY=0 so sticky-container top === viewport top === 0
      const savedY = window.scrollY;
      if (savedY !== 0) window.scrollTo(0, 0);

      const t  = titleRef.current.getBoundingClientRect();
      const h  = helloRef.current.getBoundingClientRect();
      setPos({
        titleLeft:   t.left,
        titleRight:  t.right,
        titleTop:    t.top,
        helloBottom: h.bottom,
        ready: true,
      });

      if (savedY !== 0) window.scrollTo(0, savedY);
    };
    measure();
    document.fonts.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  /* Continuous cycling scramble */
  useEffect(() => {
    const maxWords = Math.max(LEFT_WORDS.length, RIGHT_WORDS.length);

    const runCycle = () => {
      let idx = 0;

      const step = () => {
        setRevealed(idx);
        idx++;
        if (idx < maxWords) {
          timerRef.current = setTimeout(step, WORD_STEP);
        } else {
          // Hold all revealed, then reset and restart
          timerRef.current = setTimeout(() => {
            setRevealed(-1);
            timerRef.current = setTimeout(runCycle, RESET_GAP);
          }, HOLD_ALL);
        }
      };

      step();
    };

    timerRef.current = setTimeout(runCycle, 800); // initial delay
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  /* Scroll split */
  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start start", "end start"] });
  const topY    = useTransform(scrollYProgress, [0.3, 0.85], ["0%", "-110%"]);
  const bottomY = useTransform(scrollYProgress, [0.3, 0.85], ["0%",  "110%"]);

  return (
    <div ref={wrapperRef} id="hero" style={{ height: "200vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>

        {/* Top half */}
        <motion.div style={{ position: "absolute", inset: 0, clipPath: "inset(0 0 50% 0)", y: topY, willChange: "transform" }}>
          <HeroInner revealedUpTo={revealedUpTo} pos={pos} titleRef={titleRef} servusRef={servusRef} helloRef={helloRef} wrapperRef={wrapperRef} />
        </motion.div>

        {/* Bottom half */}
        <motion.div style={{ position: "absolute", inset: 0, clipPath: "inset(50% 0 0 0)", y: bottomY, willChange: "transform" }}>
          <HeroInner revealedUpTo={revealedUpTo} pos={pos} wrapperRef={wrapperRef} />
        </motion.div>

      </div>
    </div>
  );
}

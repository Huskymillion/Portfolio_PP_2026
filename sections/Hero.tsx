"use client";

import { useRef, useState, useEffect } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { ScrambleText } from "@/components/ScrambleText";

/* ─── Copy ─────────────────────────────────────── */

const LEFT_WORDS  = ["video", "social video", "motion", "motion graphics", "creative content", "creative content producer"];
const RIGHT_WORDS = ["homebase", "züri", "start of the creative journey", "munich", "studies abroad", "sweden", "born&raised", "allgäu"];

const FONT_BRIER = "'Brier', 'Arial Black', Impact, sans-serif";

/* ─── Title position (measured once after fonts load) */

interface TitlePos {
  titleLeft:   number;
  titleRight:  number;
  titleTop:    number;
  helloBottom: number;
  boxW:        number;   // hero box size — all positions are relative to the box,
  boxH:        number;   // not the viewport (iOS: 100vh ≠ innerHeight)
  ready:       boolean;
}

const DEFAULT_POS: TitlePos = { titleLeft: -1, titleRight: -1, titleTop: -1, helloBottom: -1, boxW: -1, boxH: -1, ready: false };

/* ─── Cycling scramble controller ───────────────── */

const WORD_STEP  = 350;
const HOLD_ALL   = 2200;
const RESET_GAP  = 600;

/* ─── Mobile detect ────────────────────────────── */

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
  const vw = typeof window !== "undefined" ? window.innerWidth  : 1280;

  /* Narrow screens: no room beside the title — left column sits above it,
     right column below the subline (rendered inside the subline block). */
  const stacked = pos.ready && vw < 768;

  const leftStyle: React.CSSProperties = stacked
    /* bottom edge 16 px above the measured title top; grows upward, never over the title */
    ? { position: "absolute", left: pos.titleLeft, top: pos.titleTop - 16, transform: "translateY(-100%)", display: "flex", flexDirection: "column", textAlign: "left" }
    : pos.ready
    ? { position: "absolute", right: pos.boxW - pos.titleLeft + 16, top: pos.titleTop, display: "flex", flexDirection: "column", textAlign: "right" }
    : { position: "absolute", left: "clamp(1.5rem, 4vw, 5rem)", top: "clamp(2rem, 6vh, 5rem)", display: "flex", flexDirection: "column", textAlign: "right" };

  const rightStyle: React.CSSProperties = pos.ready
    ? { position: "absolute", left: pos.titleRight + 16, bottom: pos.boxH - pos.helloBottom, display: "flex", flexDirection: "column-reverse", textAlign: "left" }
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
      {!stacked && (
        <div style={{ ...rightStyle, ...colStyle }}>
          {RIGHT_WORDS.map((w, i) => (
            <ScrambleText key={w} text={w} isActive={i <= revealedUpTo} />
          ))}
        </div>
      )}

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

      {/* Subline — centred directly below the title block */}
      <div
        style={{
          position:      "absolute",
          top:           pos.ready ? pos.helloBottom + 16 : "calc(50% + 0.84 * clamp(4.5rem, 13.5vw, 15rem) + 1rem)",
          left:          "50%",
          transform:     "translateX(-50%)",
          width:         "max-content",
          maxWidth:      "90vw",
          display:       "flex",
          flexDirection: "column",
          alignItems:    "center",
          pointerEvents: "none",
        }}
      >
        <p
          style={{
            margin:        0,
            textAlign:     "center",
            fontFamily:    "var(--font-mono)",
            fontSize:      "clamp(0.55rem, 0.85vw, 0.72rem)",
            lineHeight:    1.6,
            letterSpacing: "0.04em",
            color:         "rgba(255,255,255,0.6)",
            textTransform: "lowercase",
            pointerEvents: "none",
          }}
        >
          pascal pfohl — art direction for moving image, content production + motion design — zürich
        </p>
        {stacked && (
          <div style={{ ...colStyle, display: "flex", flexDirection: "column-reverse", textAlign: "right", alignSelf: "flex-end", marginTop: 16 }}>
            {RIGHT_WORDS.map((w, i) => (
              <ScrambleText key={w} text={w} isActive={i <= revealedUpTo} />
            ))}
          </div>
        )}
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
  const isMobile   = useIsMobile();

  const [pos, setPos]               = useState<TitlePos>(DEFAULT_POS);
  const [revealedUpTo, setRevealed] = useState(-1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /*
   * Measure title bounds for column positioning — relative to the hero box
   * (the title's offsetParent), so transforms and iOS toolbar height don't matter.
   *
   * FIX 2 — Scroll-jump removed:
   * The sticky container is always at viewport-top while within the hero scroll
   * range, so getBoundingClientRect() gives correct viewport-relative coords at
   * any scrollY. The old window.scrollTo(0,0) → measure → scrollTo(savedY)
   * pattern caused a visible jump on mobile when fonts loaded mid-scroll.
   */
  useEffect(() => {
    const measure = () => {
      const box = titleRef.current?.offsetParent;
      if (!titleRef.current || !helloRef.current || !box) return;
      const b = box.getBoundingClientRect();
      const t = titleRef.current.getBoundingClientRect();
      const h = helloRef.current.getBoundingClientRect();
      setPos({
        titleLeft:   t.left   - b.left,
        titleRight:  t.right  - b.left,
        titleTop:    t.top    - b.top,
        helloBottom: h.bottom - b.top,
        boxW:        b.width,
        boxH:        b.height,
        ready:       true,
      });
    };
    measure();
    document.fonts.ready.then(measure);
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
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
          timerRef.current = setTimeout(() => {
            setRevealed(-1);
            timerRef.current = setTimeout(runCycle, RESET_GAP);
          }, HOLD_ALL);
        }
      };
      step();
    };

    timerRef.current = setTimeout(runCycle, 800);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  /*
   * Scroll split.
   *
   * FIX 1 — Mobile: shorter wrapper (140vh vs 200vh) and tighter split window
   * [0.1 → 0.9] vs [0.3 → 0.85] so the dead zone after split completion
   * shrinks from ~30vh to ~14vh, eliminating excessive whitespace before About.
   *
   * Both transforms are always created (hooks must not be conditional), then
   * the appropriate one is selected based on isMobile.
   */
  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start start", "end start"] });

  const topYDesktop    = useTransform(scrollYProgress, [0.3,  0.85], ["0%", "-110%"]);
  const bottomYDesktop = useTransform(scrollYProgress, [0.3,  0.85], ["0%",  "110%"]);
  const topYMobile     = useTransform(scrollYProgress, [0.1,  0.9 ], ["0%", "-110%"]);
  const bottomYMobile  = useTransform(scrollYProgress, [0.1,  0.9 ], ["0%",  "110%"]);

  const topY    = isMobile ? topYMobile    : topYDesktop;
  const bottomY = isMobile ? bottomYMobile : bottomYDesktop;

  const heroHeight = isMobile ? "140vh" : "200vh";

  return (
    <div ref={wrapperRef} id="hero" style={{ height: heroHeight, position: "relative" }}>
      <h1 className="sr-only">Pascal Pfohl</h1>
      {/*
        * FIX 1 — background: "#000" added to the sticky container.
        * Previously the container had no background, so as the two halves
        * (top/bottom m.div) animated apart the page background (#fafafa)
        * bled through the gap. Now the container is always black.
        */}
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: "#000" }}>

        {/* Top half */}
        <m.div style={{ position: "absolute", inset: 0, clipPath: "inset(0 0 50% 0)", y: topY, willChange: "transform" }}>
          <HeroInner revealedUpTo={revealedUpTo} pos={pos} titleRef={titleRef} servusRef={servusRef} helloRef={helloRef} wrapperRef={wrapperRef} />
        </m.div>

        {/* Bottom half — visual duplicate of the top half, hidden from assistive tech */}
        <m.div aria-hidden="true" style={{ position: "absolute", inset: 0, clipPath: "inset(50% 0 0 0)", y: bottomY, willChange: "transform" }}>
          <HeroInner revealedUpTo={revealedUpTo} pos={pos} wrapperRef={wrapperRef} />
        </m.div>

      </div>
    </div>
  );
}

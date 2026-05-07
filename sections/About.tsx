"use client";

import { useRef, useState, useEffect } from "react";
import { m } from "framer-motion";

/* ─── Constants ─────────────────────────────────── */

const ACCENT     = "#E0115F";
const FONT_BRIER = "'Brier', 'Arial Black', Impact, sans-serif";
const FONT_MONA  = "'Mona Sans', 'Inter', 'Helvetica Neue', Arial, sans-serif";

/* ─── Body copy ─────────────────────────────────── */

type Seg = { text: string; hi?: boolean };

const BODY: Seg[] = [
  { text: "creative content. motion. photography. i like beautiful " },
  { text: "things",                    hi: true },
  { text: " + making things " },
  { text: "beautiful.",                hi: true },
  { text: " through video, concept + photography i express my " },
  { text: "unique",                    hi: true },
  { text: " perspective, turning everyday moments into captivating " },
  { text: "stories.",                  hi: true },
  { text: " currently i am a " },
  { text: "creative content producer", hi: true },
  { text: " at the " },
  { text: "zurich",                    hi: true },
  { text: " based creative agency freundliche grüsse. scroll along for some of my " },
  { text: "work.",                     hi: true },
];

/* ─── Reveal bar ─────────────────────────────────── */

interface BarSpec { index: number; top: number; height: number; total: number }

function RevealBar({ spec, triggered }: { spec: BarSpec; triggered: boolean }) {
  const dir   = spec.index % 2 === 0 ? 1 : -1;
  /* 0.15s initial pause so bars are briefly visible, then stagger */
  const delay = 0.15 + (spec.index / spec.total) * 0.45;

  return (
    <m.div
      aria-hidden
      initial={{ x: 0 }}
      animate={triggered ? { x: `${dir * 110}%` } : { x: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
      style={{
        position:      "absolute",
        left:          0,
        top:           spec.top,
        width:         "100%",
        height:        spec.height,
        background:    ACCENT,
        zIndex:        5,
        willChange:    "transform",
        pointerEvents: "none",
      }}
    />
  );
}

/* ─── About section ─────────────────────────────── */

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const bodyRef    = useRef<HTMLParagraphElement>(null);
  const [bars, setBars]         = useState<BarSpec[]>([]);
  const [triggered, setTriggered] = useState(false);

  /*
   * Manual IntersectionObserver on the body-text paragraph.
   * Fires as soon as the first pixel of text enters the viewport —
   * this is exactly when bars are visible and should start moving.
   */
  useEffect(() => {
    if (!bodyRef.current || triggered) return;
    const el = bodyRef.current;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          obs.disconnect();
        }
      },
      { threshold: 0.01 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [triggered]);

  /* Measure one bar per line of body text. */
  useEffect(() => {
    function measure() {
      if (!sectionRef.current || !bodyRef.current) return;
      const sRect = sectionRef.current.getBoundingClientRect();
      const bRect = bodyRef.current.getBoundingClientRect();
      const style = getComputedStyle(bodyRef.current);
      const lineH = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.12;

      const topOffset = bRect.top - sRect.top;
      const lineCount = Math.max(1, Math.round(bRect.height / lineH));

      setBars(
        Array.from({ length: lineCount }, (_, i) => ({
          index:  i,
          total:  lineCount,
          top:    topOffset + i * lineH - 1,
          height: lineH + 2,
        }))
      );
    }

    measure();
    document.fonts.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{
        position:  "relative",
        minHeight: "100vh",
        background:"#fafafa",
        overflow:  "hidden",
      }}
    >
      {/* Red bars cover body text; animate away when text enters viewport */}
      {bars.map((spec) => (
        <RevealBar key={spec.index} spec={spec} triggered={triggered} />
      ))}

      {/* Content */}
      <div
        style={{
          position:       "relative",
          zIndex:         1,
          minHeight:      "100vh",
          display:        "flex",
          flexDirection:  "column",
          justifyContent: "center",
          padding:        "clamp(3rem, 8vh, 6rem) clamp(1.5rem, 5vw, 5rem) clamp(2rem, 5vh, 4rem)",
        }}
      >
        <div style={{ width: "100%" }}>

          {/* Headline */}
          <div style={{ marginBottom: "clamp(1.25rem, 3vh, 2.5rem)" }}>
            <h2
              style={{
                fontFamily:    FONT_BRIER,
                fontSize:      "clamp(1rem, 4.8vw, 7rem)",
                fontWeight:    900,
                lineHeight:    1,
                letterSpacing: "-0.02em",
                color:         ACCENT,
                textTransform: "uppercase",
                whiteSpace:    "nowrap",
                margin:        0,
              }}
            >
              hello + servus. i am pascal.
            </h2>
          </div>

          {/* Body — observed to trigger bar reveal */}
          <p
            ref={bodyRef}
            style={{
              fontFamily:    FONT_MONA,
              fontSize:      "clamp(1.2rem, 4.2vw, 6rem)",
              fontWeight:    800,
              lineHeight:    1.12,
              letterSpacing: "0.01em",
              textTransform: "uppercase",
              color:         "#0a0a0a",
              margin:        0,
              textAlign:     "center",
            }}
          >
            {BODY.map((seg, i) =>
              seg.hi ? (
                <span key={i} style={{ fontFamily: FONT_BRIER, fontWeight: 900, fontStyle: "italic", color: ACCENT }}>
                  {seg.text}
                </span>
              ) : (
                <span key={i}>{seg.text}</span>
              )
            )}
          </p>

        </div>
      </div>
    </section>
  );
}

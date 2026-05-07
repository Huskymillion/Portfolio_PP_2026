"use client";

import { useRef, useState, useEffect } from "react";
import { m } from "framer-motion";

const ACCENT    = "#E0115F";
const FONT_BRIER = "'Brier', 'Arial Black', Impact, sans-serif";
const FONT_MONA  = "'Mona Sans', 'Inter', 'Helvetica Neue', Arial, sans-serif";

const PARAGRAPHS = [
  "Born into a family of photographers in the Allgäu, creativity was never a choice, it was my environment. From early portraiture to launching a sustainable streetwear label -köttur- in 2020, my work is driven by a constant visual experimentation.",
  "While influenced by the raw style of artists like -grif-, -1UP-, and the -100 Black Dolphins-, my core focus is advertising storytelling: where emotion meets sharp, reimagined narratives.",
  "I value a meticulously brewed coffee, bavarian beer, fashion, skating, and skiing. I also have a habit of naming things: dogs, plants, or objects, based on how I -perceive- them.",
  "My goal is to help brands create genuine -impact- by translating their stories.",
];

function parseInline(text: string): React.ReactNode[] {
  return text.split(/(-[^-]+-)/g).map((part, i) => {
    if (/^-[^-]+-$/.test(part)) {
      return (
        <span
          key={i}
          style={{
            fontFamily: FONT_BRIER,
            fontStyle:  "italic",
            fontWeight: 400,
            color:      ACCENT,
          }}
        >
          {part.slice(1, -1)}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

interface RevealBarProps {
  index:     number;
  direction: 1 | -1;
  delay:     number;
  triggered: boolean;
}

function RevealBar({ index, direction, delay, triggered }: RevealBarProps) {
  return (
    <m.div
      aria-hidden
      initial={{ x: direction === 1 ? "-100%" : "100%" }}
      animate={triggered ? { x: direction === 1 ? "101%" : "-101%" } : {}}
      transition={{ duration: 0.55, delay, ease: [0.76, 0, 0.24, 1] }}
      style={{
        position:   "absolute",
        left:       0,
        right:      0,
        top:        `calc(${index} * 1lh)`,
        height:     "1lh",
        background: ACCENT,
        zIndex:     2,
        willChange: "transform",
      }}
    />
  );
}

interface RevealParagraphProps {
  text: string;
  delay?: number;
}

function RevealParagraph({ text, delay = 0 }: RevealParagraphProps) {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const textRef    = useRef<HTMLParagraphElement>(null);
  const [lines, setLines]       = useState(1);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    function measure() {
      if (!textRef.current) return;
      const lh = parseFloat(getComputedStyle(textRef.current).lineHeight) || 24;
      setLines(Math.ceil(textRef.current.offsetHeight / lh));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTriggered(true); io.disconnect(); } },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} style={{ position: "relative", overflow: "hidden" }}>
      {Array.from({ length: lines }, (_, i) => (
        <RevealBar
          key={i}
          index={i}
          direction={i % 2 === 0 ? 1 : -1}
          delay={delay + i * 0.04}
          triggered={triggered}
        />
      ))}
      <p
        ref={textRef}
        style={{
          fontFamily:  FONT_MONA,
          fontSize:    "clamp(1rem, 1.8vw, 1.8rem)",
          fontWeight:  500,
          lineHeight:  1.5,
          color:       "#0a0a0a",
          margin:      0,
          position:    "relative",
          zIndex:      1,
        }}
      >
        {parseInline(text)}
      </p>
    </div>
  );
}

function useIsDesktop() {
  const [is, setIs] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIs(mq.matches);
    const h = (e: MediaQueryListEvent) => setIs(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return is;
}

export function ExtendedAbout() {
  const isDesktop = useIsDesktop();

  return (
    <section
      style={{
        background: "#fafafa",
        borderTop:  "1px solid rgba(0,0,0,0.08)",
        padding:    "clamp(4rem, 10vh, 7rem) clamp(1.5rem, 5vw, 5rem)",
      }}
    >
      <div
        style={{
          maxWidth:   isDesktop ? "55%" : "100%",
          marginLeft: isDesktop ? "auto" : undefined,
        }}
      >

        {/* Header */}
        <div
          style={{
            display:        "flex",
            alignItems:     "baseline",
            justifyContent: "space-between",
            marginBottom:   "clamp(2.5rem, 6vh, 5rem)",
            paddingBottom:  "1rem",
            borderBottom:   "1px solid rgba(0,0,0,0.12)",
          }}
        >
          <span
            style={{
              fontFamily:    FONT_BRIER,
              fontSize:      "clamp(1.8rem, 4vw, 4rem)",
              fontWeight:    900,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              color:         "#0a0a0a",
              lineHeight:    1,
            }}
          >
            about
          </span>
          <span
            style={{
              fontFamily:    FONT_MONA,
              fontSize:      "0.62rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color:         "#555",
            }}
          >
            pascal pfohl
          </span>
        </div>

        {/* Paragraphs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(1.8rem, 4vh, 3.5rem)" }}>
          {PARAGRAPHS.map((text, i) => (
            <RevealParagraph key={i} text={text} delay={0} />
          ))}
        </div>

      </div>
    </section>
  );
}

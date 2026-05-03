"use client";

import { ReactNode } from "react";

/* ─── Constants ─────────────────────────────────── */

const FONT_BRIER = "'Brier', 'Arial Black', Impact, sans-serif";
const FONT_MONO  = "var(--font-mono, 'Courier New', monospace)";

/* ─── SVG laundry symbols ───────────────────────── */

function IconNoWash() {
  return (
    <svg width="1.1em" height="1.1em" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden style={{ display: "inline-block", verticalAlign: "middle" }}>
      <rect x="1.5" y="1.5" width="17" height="17" />
      <line x1="4" y1="4" x2="16" y2="16" />
      <line x1="16" y1="4" x2="4" y2="16" />
    </svg>
  );
}

function IconNoBleach() {
  return (
    <svg width="1.1em" height="1.1em" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden style={{ display: "inline-block", verticalAlign: "middle" }}>
      <polygon points="10,2 18.5,17 1.5,17" />
      <line x1="6" y1="13" x2="14" y2="7" />
      <line x1="14" y1="13" x2="6" y2="7" />
    </svg>
  );
}

function IconNoIron() {
  return (
    <svg width="1.4em" height="1.1em" viewBox="0 0 28 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden style={{ display: "inline-block", verticalAlign: "middle" }}>
      <path d="M2,14 L2,10 Q2,7 6,7 L24,7 Q27,7 27,10 L27,14 Z" />
      <path d="M5,14 L5,16 L24,16" />
      <line x1="10" y1="3" x2="18" y2="11" />
      <line x1="18" y1="3" x2="10" y2="11" />
    </svg>
  );
}

function IconHandWash() {
  return (
    <svg width="1.1em" height="1.1em" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden style={{ display: "inline-block", verticalAlign: "middle" }}>
      <path d="M1.5,10 L18.5,10 L18.5,16.5 Q18.5,18.5 10,18.5 Q1.5,18.5 1.5,16.5 Z" />
      <path d="M7,10 Q7,5.5 10,5.5 Q13,5.5 13,10" />
      <path d="M9,3.5 Q9.5,2 10.5,3 Q11.5,2 12,3.5" />
    </svg>
  );
}

function IconNoTumble() {
  return (
    <svg width="1.1em" height="1.1em" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden style={{ display: "inline-block", verticalAlign: "middle" }}>
      <circle cx="10" cy="10" r="8" />
      <circle cx="10" cy="10" r="4" />
      <line x1="5" y1="5" x2="15" y2="15" />
      <line x1="15" y1="5" x2="5" y2="15" />
    </svg>
  );
}

/* ─── Helpers ───────────────────────────────────── */

function Row({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        display:        "flex",
        alignItems:     "center",
        flexWrap:       "wrap",
        gap:            "0.55em",
        padding:        "0.7rem clamp(1.5rem, 5vw, 5rem)",
        borderTop:      "1px solid #000",
        fontFamily:     FONT_MONO,
        fontSize:       "clamp(0.65rem, 1.1vw, 0.88rem)",
        fontWeight:     700,
        letterSpacing:  "0.04em",
        textTransform:  "uppercase",
        color:          "#0a0a0a",
        lineHeight:     1.3,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Sep() {
  return <span style={{ opacity: 0.25, userSelect: "none" }}>|</span>;
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        border:        "1.5px solid currentColor",
        borderRadius:  "999px",
        padding:       "0.1em 0.55em",
        display:       "inline-flex",
        alignItems:    "center",
        letterSpacing: "0.06em",
      }}
    >
      {children}
    </span>
  );
}

function Link({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      style={{
        color:          "inherit",
        textDecoration: "none",
        borderBottom:   "1px solid currentColor",
        paddingBottom:  "0.05em",
      }}
    >
      {children}
    </a>
  );
}

/* ─── Contact section ───────────────────────────── */

export function Contact() {
  return (
    <section
      id="contact"
      style={{
        background: "#fff",
        borderTop:  "2px solid #000",
      }}
    >

      {/* ── Row 0 : Header — Year + Location + Name ── */}
      <div
        style={{
          display:        "flex",
          alignItems:     "baseline",
          justifyContent: "space-between",
          flexWrap:       "wrap",
          gap:            "1rem 2rem",
          padding:        "clamp(2rem, 5vh, 3.5rem) clamp(1.5rem, 5vw, 5rem) clamp(1.5rem, 4vh, 3rem)",
          borderBottom:   "1px solid #000",
        }}
      >
        <span
          style={{
            fontFamily:    FONT_BRIER,
            fontSize:      "clamp(3.5rem, 9vw, 10rem)",
            fontWeight:    900,
            lineHeight:    0.9,
            letterSpacing: "-0.04em",
            color:         "#0a0a0a",
          }}
        >
          2026
        </span>

        <span
          style={{
            fontFamily:    FONT_MONO,
            fontSize:      "clamp(0.7rem, 1.2vw, 0.9rem)",
            fontWeight:    700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color:         "#0a0a0a",
            alignSelf:     "center",
          }}
        >
          {"«"} züri {"✦"} allgäu {"»"}
        </span>

        <span
          style={{
            fontFamily:    FONT_BRIER,
            fontSize:      "clamp(1.5rem, 3.5vw, 4rem)",
            fontWeight:    900,
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            lineHeight:    1,
            color:         "#0a0a0a",
          }}
        >
          ℗ascal_PfOhl {"✦"}
        </span>
      </div>

      {/* ── Row 1 : No-wash + email + symbols + instagram ── */}
      <Row>
        <IconNoWash />
        <Sep />
        <Link href="mailto:pascal@kottur.de">
          ℗ascal@kottur.de
        </Link>
        <Sep />
        <span style={{ fontFamily: FONT_BRIER, fontStyle: "italic" }}>&ldquo;&rdquo;</span>
        <span>&#9679;</span>
        <span>&#8855;</span>
        <span>&#169;</span>
        <span>&#215;</span>
        <Sep />
        <Link href="https://www.instagram.com/huskymillion/">
          huskymillion
        </Link>
        <Sep />
        <IconNoIron />
        <IconNoBleach />
        <span style={{ letterSpacing: "0.02em" }}>&#10026;</span>
      </Row>

      {/* ── Row 2 : Play + symbols + telephone + phone number ── */}
      <Row>
        <span>&#9654;</span>
        <span>:&#215;:</span>
        <Sep />
        <IconNoTumble />
        <Sep />
        <Pill>telephone</Pill>
        <Sep />
        <span>&amp;&#177;</span>
        <Link href="tel:+41774701795">
          +41&thinsp;77&thinsp;470&thinsp;17&thinsp;95
        </Link>
        <Sep />
        <span style={{ fontSize: "0.8em", opacity: 0.5 }}>&#9638;</span>
        <span>&#10057;&#10057;</span>
        <span style={{ fontFamily: FONT_BRIER, fontStyle: "italic" }}>3/4</span>
      </Row>

      {/* ── Row 3 : Hand wash + social + linkedin ── */}
      <Row>
        <span style={{ fontFamily: FONT_BRIER, fontStyle: "italic" }}>{"««"}</span>
        <span style={{ fontFamily: FONT_BRIER, fontStyle: "italic" }}>{"»»"}</span>
        <Sep />
        <IconHandWash />
        <Sep />
        <span
          style={{
            fontFamily:    FONT_BRIER,
            fontSize:      "clamp(0.8rem, 1.4vw, 1.1rem)",
            fontWeight:    900,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
          }}
        >
          ℗ASCAL_PFOHL
        </span>
        <Sep />
        <Link href="https://www.instagram.com/huskymillion/">
          huskymillion
        </Link>
        <Sep />
        <span style={{ fontFamily: FONT_BRIER, fontStyle: "italic" }}>{"«"}</span>
        <span style={{ fontFamily: FONT_BRIER, fontStyle: "italic" }}>{"»"}</span>
        <span>&#9658;</span>
        <Link href="https://www.linkedin.com/in/pascal-pfohl-950a70173/">
          &#174;inkedIn
        </Link>
        <Sep />
        <span>&#9679;</span>
        <span>&#8855;</span>
        <span>&#169;</span>
        <span>&#9825;</span>
      </Row>

      {/* ── Bottom strip ── */}
      <div
        style={{
          padding:       "0.6rem clamp(1.5rem, 5vw, 5rem)",
          borderTop:     "1px solid rgba(0,0,0,0.15)",
          display:       "flex",
          justifyContent:"space-between",
          alignItems:    "center",
          gap:           "1rem",
        }}
      >
        <span
          style={{
            fontFamily:    FONT_MONO,
            fontSize:      "0.55rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color:         "#555",
          }}
        >
          &#169; 2026 pascal pfohl. all rights reserved.
        </span>
        <span
          style={{
            fontFamily:    FONT_MONO,
            fontSize:      "0.55rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color:         "#555",
          }}
        >
          future homebase 2026
        </span>
      </div>

    </section>
  );
}

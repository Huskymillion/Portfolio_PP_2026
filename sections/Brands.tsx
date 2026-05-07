"use client";

import { useState, useEffect } from "react";
import { m } from "framer-motion";

const FONT_MONA  = "'Mona Sans', 'Inter', 'Helvetica Neue', Arial, sans-serif";
const FONT_BRIER = "'Brier', 'Arial Black', Impact, sans-serif";

const BRANDS = [
  "alh gruppe", "alpha tauri", "apollo", "asset metrix", "atos unify",
  "caritas", "dachser", "daiichi sankyo", "ewz", "exlibris",
  "faz", "fussball kann mehr", "globus baumarkt", "iba", "immoscout24",
  "kantonsspital winterthur", "kantonspolizei bern", "kfh", "migros ici",
  "nzz am sonntag", "obi", "radicant", "ricardo", "schweizer fussballverband",
  "schweizer paraplegiker stiftung", "sgm", "siemens", "sloggi",
  "stadt zürich", "tkmaxx", "westwing", "woz", "xxxlutz", "yfood",
];

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

function BrandName({ name, index }: { name: string; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <m.span
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={{ color: hovered ? "#0a0a0a" : "#888" }}
      transition={{ duration: 0.12 }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      style={{
        fontFamily:    FONT_MONA,
        fontSize:      "clamp(0.85rem, 1.1vw, 1.05rem)",
        fontWeight:    450,
        letterSpacing: "-0.01em",
        cursor:        "default",
        display:       "inline-block",
        whiteSpace:    "nowrap",
        transition:    "color 0.12s ease",
      }}
    >
      {name}
    </m.span>
  );
}

export function Brands() {
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
          maxWidth:    isDesktop ? "55%" : "100%",
          marginRight: isDesktop ? "auto" : undefined,
        }}
      >

        {/* Header */}
        <div
          style={{
            marginBottom:  "clamp(2rem, 5vh, 4rem)",
            paddingBottom: "1rem",
            borderBottom:  "1px solid rgba(0,0,0,0.12)",
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
            clients
          </span>
        </div>

        {/* Inline flow with middot separators */}
        <p style={{ margin: 0, lineHeight: 2 }}>
          {BRANDS.map((brand, i) => (
            <span key={brand}>
              <BrandName name={brand} index={i} />
              {i < BRANDS.length - 1 && (
                <span
                  aria-hidden
                  style={{
                    fontFamily:  FONT_MONA,
                    fontSize:    "clamp(0.85rem, 1.1vw, 1.05rem)",
                    color:       "#ccc",
                    padding:     "0 0.45em",
                    userSelect:  "none",
                  }}
                >
                  ·
                </span>
              )}
            </span>
          ))}
        </p>

      </div>
    </section>
  );
}

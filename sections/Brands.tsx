"use client";

import { motion } from "framer-motion";

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

export function Brands() {
  return (
    <section
      style={{
        background: "#fff",
        borderTop:  "1px solid rgba(0,0,0,0.08)",
        padding:    "clamp(4rem, 10vh, 7rem) clamp(1.5rem, 5vw, 5rem)",
      }}
    >
      <div style={{ maxWidth: "min(1280px, 96vw)", margin: "0 auto" }}>

        {/* Label */}
        <div
          style={{
            display:        "flex",
            alignItems:     "baseline",
            justifyContent: "space-between",
            marginBottom:   "clamp(2rem, 5vh, 4rem)",
            paddingBottom:  "1rem",
            borderBottom:   "1px solid rgba(0,0,0,0.1)",
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
          <span
            style={{
              fontFamily:    FONT_MONA,
              fontSize:      "0.62rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color:         "#bbb",
            }}
          >
            {BRANDS.length} brands
          </span>
        </div>

        {/* Grid */}
        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap:                 0,
          }}
        >
          {BRANDS.map((brand, i) => (
            <motion.div
              key={brand}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.3, delay: (i % 5) * 0.04 }}
              style={{
                borderTop:   "1px solid rgba(0,0,0,0.08)",
                padding:     "0.75rem 0 0.75rem",
                paddingRight: "1rem",
              }}
            >
              <span
                style={{
                  fontFamily:    FONT_MONA,
                  fontSize:      "clamp(0.7rem, 0.95vw, 0.88rem)",
                  fontWeight:    500,
                  color:         "#0a0a0a",
                  letterSpacing: "-0.01em",
                  display:       "block",
                }}
              >
                {brand}
              </span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

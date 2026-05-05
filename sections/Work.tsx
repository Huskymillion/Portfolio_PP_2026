"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, type MotionValue } from "framer-motion";
import { PROJECTS, type Project, type Layout } from "@/lib/projects";
import { imageUrl, videoUrl } from "@/lib/media";

/* ─── Constants ─────────────────────────────────── */

const ACCENT     = "#E0115F";
const FONT_BRIER = "'Brier', 'Arial Black', Impact, sans-serif";
const FONT_MONA  = "'Mona Sans', 'Inter', 'Helvetica Neue', Arial, sans-serif";

export type { Project, Layout };

/* ─── Thumbnail hover card ──────────────────────── */

function Thumbnail({ project, visible, x, y }: {
  project: Project | null; visible: boolean; x: number; y: number;
}) {
  return (
    <AnimatePresence>
      {visible && project && (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1,  scale: 1    }}
          exit={{    opacity: 0,  scale: 0.88 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position:       "fixed",
            left:           x + 20,
            top:            y - 60,
            width:          140,
            height:         100,
            borderRadius:   2,
            background:     project.accent,
            pointerEvents:  "none",
            zIndex:         200,
            overflow:       "hidden",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl(project.id, "thumb")}
            alt=""
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Work Index row ────────────────────────────── */

function WorkRow({ project, onHover, onLeave, onMouseMove, onClick }: {
  project:     Project;
  onHover:     (p: Project) => void;
  onLeave:     () => void;
  onMouseMove: (x: number, y: number) => void;
  onClick:     () => void;
}) {
  const [active, setActive] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => { setActive(true);  onHover(project); }}
      onMouseLeave={() => { setActive(false); onLeave(); }}
      onMouseMove={(e) => onMouseMove(e.clientX, e.clientY)}
      style={{
        display:      "flex",
        alignItems:   "center",
        width:        "100%",
        padding:      "clamp(0.9rem, 1.8vh, 1.6rem) 0",
        background:   "none",
        border:       "none",
        borderBottom: "1px solid rgba(0,0,0,0.12)",
        cursor:       "pointer",
        textAlign:    "left",
        gap:          "clamp(1.5rem, 4vw, 4rem)",
      }}
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* Number pill */}
      <motion.div
        animate={{ background: active ? ACCENT : "transparent", borderColor: active ? ACCENT : "#0a0a0a" }}
        transition={{ duration: 0.15 }}
        style={{
          flexShrink:     0,
          padding:        "0.55em 1.4em",
          borderRadius:   "9999px",
          border:         "2px solid #0a0a0a",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
        }}
      >
        <motion.span
          animate={{ color: active ? "#fff" : "#0a0a0a" }}
          transition={{ duration: 0.15 }}
          style={{ fontFamily: FONT_BRIER, fontSize: "clamp(1.35rem, 2.3vw, 2rem)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1 }}
        >
          {project.id}
        </motion.span>
      </motion.div>

      {/* Project info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <motion.div
          animate={{ color: active ? ACCENT : "#0a0a0a" }}
          transition={{ duration: 0.15 }}
          style={{ fontFamily: FONT_MONA, fontSize: "clamp(1rem, 2.2vw, 2rem)", fontWeight: 800, letterSpacing: "-0.02em", textTransform: "uppercase", lineHeight: 1 }}
        >
          {project.name}
        </motion.div>
        <div style={{ fontFamily: FONT_MONA, fontSize: "clamp(0.65rem, 1vw, 0.85rem)", color: "#555", marginTop: "0.3rem", letterSpacing: "0.04em", textTransform: "lowercase" }}>
          {project.type}
        </div>
      </div>

      {/* Services */}
      <div style={{ fontFamily: FONT_MONA, fontSize: "clamp(0.6rem, 0.9vw, 0.8rem)", color: ACCENT, letterSpacing: "0.03em", textTransform: "lowercase", textAlign: "right", flexShrink: 0, maxWidth: "35%" }}>
        {project.services}
      </div>

      {/* '+' reveal */}
      <motion.span
        animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.5, x: active ? 0 : -6 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        style={{ fontFamily: FONT_BRIER, fontSize: "clamp(1.1rem, 1.8vw, 1.6rem)", fontWeight: 900, color: ACCENT, flexShrink: 0, width: "1.6rem", textAlign: "center", lineHeight: 1, display: "block" }}
      >
        +
      </motion.span>
    </motion.button>
  );
}

/* ─── Part A: Work Index ────────────────────────── */

export function WorkIndex({ projects: propProjects }: { projects?: Project[] } = {}) {
  const projects = propProjects ?? PROJECTS;
  const [hovered, setHovered]  = useState<Project | null>(null);
  const [cursorPos, setCursor] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((x: number, y: number) => {
    setCursor({ x, y });
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(`case-${id}`)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="work"
      style={{
        position:   "relative",
        background: "#fafafa",
        padding:    "clamp(6rem, 15vh, 10rem) clamp(1.5rem, 5vw, 5rem) clamp(4rem, 8vh, 6rem)",
      }}
    >
      <Thumbnail project={hovered} visible={!!hovered} x={cursorPos.x} y={cursorPos.y} />

      <div>

        {/* Section label */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "2rem", marginBottom: "clamp(2rem, 5vh, 4rem)", borderTop: "2px solid #0a0a0a", paddingTop: "1.5rem" }}>
          <span style={{ fontFamily: FONT_BRIER, fontSize: "clamp(2rem, 5vw, 5rem)", fontWeight: 900, letterSpacing: "-0.03em", textTransform: "uppercase", lineHeight: 1 }}>
            Work
          </span>
          <span style={{ fontFamily: FONT_MONA, fontSize: "clamp(0.65rem, 1vw, 0.85rem)", color: "#555", letterSpacing: "0.06em", textTransform: "uppercase", marginLeft: "auto" }}>
            Selected works spanning campaign design,<br />branding, art direction, video, motion, and more.
          </span>
        </div>

        {/* Per-row intersection-triggered fade — each row fires its own observer */}
        <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)" }}>
          {projects.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.55 }}
              transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
            >
              <WorkRow
                project={p}
                onHover={setHovered}
                onLeave={() => setHovered(null)}
                onMouseMove={handleMouseMove}
                onClick={() => scrollTo(p.id)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════
   PART B — WORK OVERVIEW GRID (scroll-reveal)
   ══════════════════════════════════════════════════ */

function OverviewCard({
  project,
  scrollYProgress,
  index,
  total,
}: {
  project:         Project;
  scrollYProgress: MotionValue<number>;
  index:           number;
  total:           number;
}) {
  const HOLD_START = 0.78; // last ~22% of scroll holds all cards visible
  const step       = HOLD_START / total;
  const start      = index * step;
  const end        = start + step * 0.65;

  const opacity = useTransform(scrollYProgress, [start, end], [0, 1]);
  const y       = useTransform(scrollYProgress, [start, end], [28, 0]);

  const scrollTo = () => {
    document.getElementById(`case-${project.id}`)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.button
      onClick={scrollTo}
      style={{
        opacity,
        y,
        position:       "relative",
        background:     project.accent,
        border:         "none",
        borderRadius:   4,
        overflow:       "hidden",
        cursor:         "pointer",
        padding:        0,
        display:        "flex",
        flexDirection:  "column",
        justifyContent: "flex-end",
        alignItems:     "flex-start",
        textAlign:      "left",
        minHeight:      0,
      }}
      whileHover={{ scale: 1.03, transition: { duration: 0.2, ease: "easeOut" } }}
    >
      <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem", fontFamily: FONT_BRIER, fontSize: "0.6rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>
        {project.id}
      </div>
      <div style={{ position: "relative", padding: "0.75rem", width: "100%" }}>
        <div style={{ fontFamily: FONT_BRIER, fontSize: "clamp(0.75rem, 1.1vw, 1.1rem)", fontWeight: 900, color: "#fff", textTransform: "uppercase", letterSpacing: "-0.01em", lineHeight: 1.1 }}>
          {project.name}
        </div>
        <div style={{ fontFamily: FONT_MONA, fontSize: "clamp(0.5rem, 0.7vw, 0.65rem)", color: "rgba(255,255,255,0.5)", marginTop: "0.2rem", letterSpacing: "0.04em", textTransform: "lowercase" }}>
          {project.type}
        </div>
      </div>
    </motion.button>
  );
}

export function WorkOverview() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start start", "end end"] });
  const n = PROJECTS.length;

  return (
    <div ref={wrapperRef} id="overview" style={{ height: `${n * 100 + 100}vh`, position: "relative" }}>
      <div
        style={{
          position:      "sticky",
          top:           0,
          height:        "100vh",
          background:    "#0a0a0a",
          overflow:      "hidden",
          display:       "flex",
          flexDirection: "column",
          padding:       "clamp(2.5rem, 4vh, 4rem) clamp(1.5rem, 5vw, 5rem) clamp(2rem, 4vh, 3.5rem)",
          gap:           "1.25rem",
        }}
      >
        {/* Header */}
        <div
          style={{
            display:        "flex",
            alignItems:     "baseline",
            justifyContent: "space-between",
            borderBottom:   "1px solid rgba(255,255,255,0.08)",
            paddingBottom:  "0.75rem",
            flexShrink:     0,
          }}
        >
          <span style={{ fontFamily: FONT_BRIER, fontSize: "clamp(0.7rem, 1vw, 0.9rem)", color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Overview
          </span>
          <span style={{ fontFamily: FONT_MONA, fontSize: "clamp(0.6rem, 0.85vw, 0.75rem)", color: "rgba(255,255,255,0.18)", letterSpacing: "0.06em" }}>
            {n} projects — scroll to reveal · click to jump
          </span>
        </div>

        {/* Grid — fills remaining space */}
        <div
          style={{
            flex:                1,
            display:             "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows:    `repeat(${Math.ceil(n / 4)}, 1fr)`,
            gap:                 "clamp(0.5rem, 0.8vw, 0.9rem)",
            minHeight:           0,
          }}
        >
          {PROJECTS.map((p, i) => (
            <OverviewCard
              key={p.id}
              project={p}
              scrollYProgress={scrollYProgress}
              index={i}
              total={n}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   PART C — CASE STUDY TEMPLATES
   ══════════════════════════════════════════════════ */

/* ─── 16×9 Fullscreen Video ─────────────────────── */

export function FullscreenVideo({ project }: { project: Project }) {
  const ref      = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const idleRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [ready,   setReady]   = useState(false);
  const [paused,  setPaused]  = useState(false);
  const [muted,   setMuted]   = useState(true);
  const [ctrlVis, setCtrlVis] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 40%"] });

  /* Scroll-triggered play / pause */
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      if (!videoRef.current || !ready) return;
      if (v > 0.8 && videoRef.current.paused)  { videoRef.current.play().catch(() => {}); setPaused(false); }
      if (v < 0.3 && !videoRef.current.paused) { videoRef.current.pause(); setPaused(true); }
    });
    return unsub;
  }, [scrollYProgress, ready]);

  /* Pause when section scrolls completely off screen */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
        setPaused(true);
      }
    }, { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Mouse-idle control visibility — show on move, hide after 2.5s idle */
  const showControls = useCallback(() => {
    setCtrlVis(true);
    if (idleRef.current) clearTimeout(idleRef.current);
    idleRef.current = setTimeout(() => setCtrlVis(false), 2500);
  }, []);

  /* Hero video is always muted for autoplay — ensure volume=0 on mount so
     browsers that gate autoplay on both muted+volume respect it. */
  useEffect(() => { if (videoRef.current) videoRef.current.volume = 0; }, []);

  useEffect(() => () => { if (idleRef.current) clearTimeout(idleRef.current); }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) { videoRef.current.play().catch(() => {}); setPaused(false); }
    else                         { videoRef.current.pause(); setPaused(true); }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const nowMuted = !videoRef.current.muted;
    videoRef.current.muted = nowMuted;
    if (!nowMuted) videoRef.current.volume = 0.7; // restore audible level when unmuting
    setMuted(nowMuted);
  };

  return (
    <div
      ref={ref}
      onClick={togglePlay}
      onMouseMove={showControls}
      onMouseLeave={() => { setCtrlVis(false); if (idleRef.current) clearTimeout(idleRef.current); }}
      style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", background: project.accent, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
    >
      <video
        ref={videoRef}
        src={videoUrl(project.id, "hero")}
        poster={imageUrl(project.id, "poster")}
        muted loop playsInline preload="metadata"
        onCanPlay={() => setReady(true)}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", opacity: ready ? 1 : 0, transition: "opacity 0.5s ease" }}
      />
      <span style={{ fontFamily: FONT_MONA, fontSize: "clamp(0.7rem, 1.2vw, 1rem)", color: "#fff", opacity: ready ? 0 : 0.35, textTransform: "uppercase", letterSpacing: "0.08em", transition: "opacity 0.5s ease", pointerEvents: "none" }}>
        {project.name}
      </span>

      {/* Controls — fade in on mouse move, fade out after 2.5s idle */}
      <motion.div
        animate={{ opacity: ctrlVis ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}
      >
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {paused ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="#fff"><polygon points="6,3 17,10 6,17" /></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="#fff"><rect x="4" y="3" width="4" height="14" rx="1"/><rect x="12" y="3" width="4" height="14" rx="1"/></svg>
          )}
        </div>
      </motion.div>

      <motion.button
        animate={{ opacity: ctrlVis ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        onClick={toggleMute}
        style={{ position: "absolute", bottom: "1.25rem", right: "1.25rem", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", pointerEvents: ctrlVis ? "auto" : "none" }}
      >
        {muted ? (
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-label="Unmute">
            <path d="M3 7H7L11 3V17L7 13H3V7Z" fill="#fff"/>
            <line x1="14" y1="7" x2="18" y2="13" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            <line x1="18" y1="7" x2="14" y2="13" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-label="Mute">
            <path d="M3 7H7L11 3V17L7 13H3V7Z" fill="#fff"/>
            <path d="M14 8C15 8.8 15.5 9.4 15.5 10C15.5 10.6 15 11.2 14 12" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            <path d="M16.5 5.5C18.5 7 19.5 8.4 19.5 10C19.5 11.6 18.5 13 16.5 14.5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
      </motion.button>
    </div>
  );
}

/* ─── 9×16 Social Video — stacked fan ──────────── */

const CARD_COUNT = 5;

function useCardDims() {
  const [dims, setDims] = useState({ w: 180, h: 320, spacing: 130 });
  useEffect(() => {
    function calc() {
      const vw = window.innerWidth;
      if (vw < 1024) { setDims({ w: 180, h: 320, spacing: 130 }); return; }
      // Scale card height to 55 % of viewport height — looks right on every monitor size
      const h = Math.round(Math.min(Math.max(window.innerHeight * 0.55, 280), 820));
      const w = Math.round(h * 9 / 16);
      setDims({ w, h, spacing: Math.round(w * 0.72) });
    }
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  return dims;
}

function SocialCard({
  project, index, hoveredIndex, setHoveredIndex, forcePause, cardW, cardH, cardSpacing,
}: {
  project:         Project;
  index:           number;
  hoveredIndex:    number | null;
  setHoveredIndex: (i: number | null) => void;
  forcePause:      boolean;
  cardW:           number;
  cardH:           number;
  cardSpacing:     number;
}) {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const isHovered = hoveredIndex === index;
  const [muted, setMuted] = useState(false);

  /* Pause when the grid section leaves the viewport */
  useEffect(() => {
    if (forcePause) videoRef.current?.pause();
  }, [forcePause]);

  const centre   = (CARD_COUNT - 1) / 2;
  const offset   = index - centre;
  const baseZ    = CARD_COUNT - Math.abs(Math.round(offset));
  const rotation = offset * 4;
  const isDimmed = hoveredIndex !== null && !isHovered;

  const handleHover = (on: boolean) => {
    setHoveredIndex(on ? index : null);
    if (on) {
      if (videoRef.current) {
        videoRef.current.muted  = muted;
        videoRef.current.volume = 0.7; // normalised level for manually-played videos
        videoRef.current.play().catch(() => {});
      }
    } else {
      videoRef.current?.pause();
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const nowMuted = !videoRef.current.muted;
    videoRef.current.muted = nowMuted;
    if (!nowMuted) videoRef.current.volume = 0.7;
    setMuted(nowMuted);
  };

  const n = String(index + 1).padStart(2, "0");

  return (
    <motion.div
      onHoverStart={() => handleHover(true)}
      onHoverEnd={() => handleHover(false)}
      animate={{
        x:       offset * cardSpacing,
        rotate:  isHovered ? 0 : rotation,
        scale:   isHovered ? 1.08 : 1,
        zIndex:  isHovered ? 50 : baseZ,
        opacity: isDimmed ? 0.3 : 1,
      }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position:        "absolute",
        width:           cardW,
        height:          cardH,
        borderRadius:    14,
        overflow:        "hidden",
        background:      project.accent,
        cursor:          "pointer",
        transformOrigin: "bottom center",
        display:         "flex",
        flexDirection:   "column",
        justifyContent:  "flex-end",
        alignItems:      "flex-start",
      }}
    >
      {/* Video — plays on hover, shows poster when paused */}
      <video
        ref={videoRef}
        src={videoUrl(project.id, `grid-${n}`)}
        poster={imageUrl(project.id, `grid-${n}-thumb`)}
        loop playsInline preload="metadata"
        muted={muted}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }}
      />

      {/* Play indicator — bare triangle, 65% → 100% on hover */}
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0.65 }}
        transition={{ duration: 0.22 }}
        style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3, pointerEvents: "none" }}
      >
        <svg width="14" height="16" viewBox="0 0 12 14" fill="none" aria-label="Play">
          <polygon points="1,1 11,7 1,13" fill="#fff" />
        </svg>
      </motion.div>

      {/* Bottom gradient for label legibility */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.75))", zIndex: 1, pointerEvents: "none" }} />

      {/* Label + mute toggle */}
      <div style={{ position: "relative", zIndex: 2, padding: "0.75rem", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ fontFamily: FONT_MONA, fontSize: "0.58rem", color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {project.name} / {n}
        </div>
        {isHovered && (
          <button
            onClick={toggleMute}
            style={{ background: "rgba(0,0,0,0.55)", border: "none", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
          >
            {muted ? (
              <svg width="10" height="10" viewBox="0 0 20 20" fill="none">
                <path d="M3 7H7L11 3V17L7 13H3V7Z" fill="#fff"/>
                <line x1="14" y1="7" x2="18" y2="13" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                <line x1="18" y1="7" x2="14" y2="13" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 20 20" fill="none">
                <path d="M3 7H7L11 3V17L7 13H3V7Z" fill="#fff"/>
                <path d="M14 8C15 8.8 15.5 9.4 15.5 10C15.5 10.6 15 11.2 14 12" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
}

export function SocialGrid({ project }: { project: Project }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [offScreen,    setOffScreen]    = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { w: cardW, h: cardH, spacing: cardSpacing } = useCardDims();

  /* Pause all videos when this section scrolls off screen */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      const hidden = !entry.isIntersecting;
      setOffScreen(hidden);
      if (hidden) setHoveredIndex(null);
    }, { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position:       "relative",
        height:         cardH + 80,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        paddingTop:     "clamp(2rem, 5vh, 4rem)",
        paddingBottom:  cardW > 180 ? "0.75rem" : "clamp(2rem, 5vh, 4rem)",
        overflow:       "visible",
      }}
    >
      <div style={{ position: "relative", width: cardW, height: cardH }}>
        {Array.from({ length: CARD_COUNT }, (_, i) => (
          <SocialCard
            key={i}
            project={project}
            index={i}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
            forcePause={offScreen}
            cardW={cardW}
            cardH={cardH}
            cardSpacing={cardSpacing}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Horizontal Image Timeline ──────────────────── */

const LANDSCAPE_SIZES = [
  { w: "62vw", h: "62vh" },
  { w: "36vw", h: "74vh" },
  { w: "50vw", h: "58vh" },
  { w: "38vw", h: "70vh" },
  { w: "58vw", h: "60vh" },
];

function getPanels(project: Project) {
  const count = project.panelCount ?? 5;
  if (count === 0) return [];
  return LANDSCAPE_SIZES.slice(0, count).map((s) => ({ ...s, portrait: false }));
}

export function HorizontalTimeline({ project }: { project: Project }) {
  const panels = getPanels(project);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const xMotion    = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target:  wrapperRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    if (panels.length === 0) return;
    /* Returns how many px the gallery must travel until the last panel's
       right edge aligns with the viewport right edge (excludes paddingRight). */
    const getDistance = () => {
      if (!galleryRef.current) return 0;
      const pr = parseFloat(getComputedStyle(galleryRef.current).paddingRight) || 0;
      return Math.max(0, galleryRef.current.scrollWidth - pr - window.innerWidth);
    };

    /* Push the correct pixel offset to xMotion from current progress. */
    const applyX = () => {
      xMotion.set(-getDistance() * scrollYProgress.get());
    };

    /*
     * 1. Measure gallery scrollWidth.
     * 2. Set wrapper height so sticky stays alive until the last panel clears.
     * 3. Immediately update xMotion so jumps (e.g. instant scrollTo) work.
     */
    const sync = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const dist = getDistance();
      wrapper.style.height = `${dist + window.innerHeight}px`;
      applyX();
    };

    // Run after first layout (fonts + flex affect scrollWidth).
    requestAnimationFrame(sync);

    // Drive xMotion on every Lenis / native scroll tick.
    const unsubscribe = scrollYProgress.on("change", applyX);

    window.addEventListener("resize", sync);
    return () => {
      unsubscribe();
      window.removeEventListener("resize", sync);
    };
  }, [scrollYProgress, xMotion, panels.length]);

  if (panels.length === 0) return null;

  return (
    <div ref={wrapperRef} style={{ position: "relative", minHeight: "300vh" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden", background: "#0a0a0a" }}>

        {/* Scroll hint */}
        <div style={{
          position:      "absolute",
          top:           "2rem",
          right:         "clamp(1.5rem, 4vw, 4rem)",
          fontFamily:    FONT_MONA,
          fontSize:      "0.6rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color:         "rgba(255,255,255,0.65)",
          zIndex:        2,
        }}>
          → scroll
        </div>

        <motion.div
          ref={galleryRef}
          style={{
            display:    "flex",
            alignItems: "center",
            gap:        "clamp(1.5rem, 2.5vw, 3rem)",
            height:     "100%",
            paddingLeft:"5vw",
            paddingRight:"5vw",
            x:          xMotion,
            willChange: "transform",
          }}
        >
          {panels.map((panel, i) => (
            <div
              key={i}
              style={{
                flexShrink: 0,
                width:      panel.w,
                height:     panel.h,
                position:   "relative",
                borderRadius: 2,
                overflow:   "hidden",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl(project.id, `panel-${String(i + 1).padStart(2, "0")}`)}
                alt=""
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Case Study meta strip ─────────────────────── */

function CaseStudyMeta({ project, textPrimary, textMuted, textSubtle }: {
  project:     Project;
  textPrimary: string;
  textMuted:   string;
  textSubtle:  string;
}) {
  return (
    <div
      style={{
        display:        "flex",
        alignItems:     "flex-end",
        justifyContent: "space-between",
        gap:            "2rem",
        padding:        "clamp(2rem, 4vh, 3.5rem) clamp(1.5rem, 5vw, 5rem) clamp(1.25rem, 2.5vh, 2rem)",
        flexShrink:     0,
      }}
    >
      {/* Left: number + name + tagline */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "clamp(1rem, 2vw, 2.5rem)", minWidth: 0 }}>
        <span style={{ fontFamily: FONT_BRIER, fontSize: "clamp(0.65rem, 0.9vw, 0.85rem)", color: ACCENT, letterSpacing: "0.1em", flexShrink: 0, paddingTop: "0.2em" }}>
          {project.id}
        </span>
        <div>
          <div style={{ fontFamily: FONT_BRIER, fontSize: "clamp(1.6rem, 4vw, 4.5rem)", fontWeight: 900, letterSpacing: "-0.03em", textTransform: "uppercase", lineHeight: 1, color: textPrimary }}>
            {project.name}
          </div>
          {project.tagline && (
            <div style={{ fontFamily: FONT_MONA, fontSize: "clamp(0.72rem, 1vw, 0.92rem)", fontStyle: "italic", color: textSubtle, marginTop: "0.35em", letterSpacing: "0.01em" }}>
              {project.tagline}
            </div>
          )}
        </div>
      </div>
      {/* Right: type + services */}
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontFamily: FONT_MONA, fontSize: "clamp(0.6rem, 0.85vw, 0.78rem)", color: textMuted, letterSpacing: "0.04em", textTransform: "uppercase" }}>
          {project.type}
        </div>
        <div style={{ fontFamily: FONT_MONA, fontSize: "clamp(0.55rem, 0.75vw, 0.7rem)", color: textMuted, marginTop: "0.2rem", letterSpacing: "0.02em" }}>
          {project.services}
        </div>
      </div>
    </div>
  );
}

/* ─── Full Case Study section ───────────────────── */

export function CaseStudy({ project }: { project: Project }) {
  const hasTimeline = project.extra === "timeline";
  const dark        = !!project.darkSection;
  const sectionBg   = dark ? "#0a0a0a" : "#fafafa";
  const textPrimary = dark ? "#fafafa"  : "#0a0a0a";
  const textMuted   = dark ? "rgba(255,255,255,0.5)"  : "#555";
  const textSubtle  = dark ? "rgba(255,255,255,0.35)" : "#777";

  return (
    <section
      id={`case-${project.id}`}
      style={{
        background: sectionBg,
        position:   "relative",
        minHeight:  "100vh",
        overflowX:  hasTimeline ? "clip" : (project.layout === "grid9x16" ? "clip" : "hidden"),
        overflowY:  hasTimeline ? "visible" : "clip",
      }}
    >

      {/* Fade-in entry: meta + first content block */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position:      "relative",
          zIndex:        1,
          minHeight:     "100vh",
          display:       "flex",
          flexDirection: "column",
        }}
      >
        <CaseStudyMeta project={project} textPrimary={textPrimary} textMuted={textMuted} textSubtle={textSubtle} />

        {/* Description block — sits between header and media */}
        {project.description && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ padding: "clamp(0.75rem, 2vh, 1.5rem) clamp(1.5rem, 5vw, 5rem)" }}
          >
            <p style={{ fontFamily: FONT_MONA, fontSize: "clamp(0.88rem, 1.1vw, 1rem)", fontWeight: 400, color: textMuted, lineHeight: 1.7, maxWidth: "800px", margin: 0 }}>
              {project.description}
            </p>
          </motion.div>
        )}

        {/* Content fills remaining viewport height */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: project.layout === "grid9x16" ? "visible" : "hidden" }}>
          {project.layout === "video16x9" && (
            /* No explicit background — section bg shows through. paddingBottom: 0 when
               a timeline follows immediately to avoid a visible gap between the two blocks. */
            <div style={{ paddingTop: "clamp(3rem, 6vh, 5rem)", paddingBottom: hasTimeline ? 0 : "clamp(1.5rem, 3vh, 2.5rem)" }}>
              <FullscreenVideo project={project} />
            </div>
          )}
          {project.layout === "grid9x16" && (project.gridCount ?? 1) > 0 && (
            <SocialGrid project={project} />
          )}
        </div>
      </motion.div>

      {/* Horizontal timeline — break out of overflow:hidden parent */}
      {hasTimeline && <HorizontalTimeline project={project} />}
    </section>
  );
}

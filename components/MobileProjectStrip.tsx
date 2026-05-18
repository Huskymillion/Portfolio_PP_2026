"use client";

import { useRef, useState, useEffect } from "react";
import { imageUrl, videoUrl } from "@/lib/media";
import type { Project } from "@/lib/projects";

const FONT_BRIER = "'Brier', 'Arial Black', Impact, sans-serif";

/* ─── Media item types ──────────────────────────── */

type VideoItem = { kind: "video"; src: string; poster: string };
type ImageItem = { kind: "image"; src: string; alt: string };
type MediaItem = VideoItem | ImageItem;

/* ─── Build ordered item list from project data ─── */

function buildMediaItems(project: Project): MediaItem[] {
  const items: MediaItem[] = [];

  if (project.layout === "video16x9") {
    items.push({
      kind:   "video",
      src:    videoUrl(project.id, "hero"),
      poster: imageUrl(project.id, "poster"),
    });
  }

  if (project.layout === "grid9x16") {
    const count = project.gridCount ?? 5;
    for (let i = 1; i <= count; i++) {
      const key = `grid-${String(i).padStart(2, "0")}`;
      items.push({
        kind:   "video",
        src:    videoUrl(project.id, key),
        poster: imageUrl(project.id, `${key}-thumb`),
      });
    }
  }

  if (project.extra === "timeline") {
    const count = project.panelCount ?? 4;
    for (let i = 1; i <= count; i++) {
      const key = `panel-${String(i).padStart(2, "0")}`;
      items.push({
        kind: "image",
        src:  imageUrl(project.id, key),
        alt:  `${project.name} — photo ${i}`,
      });
    }
  }

  return items;
}

/* ─── Square-frame play indicator (Swiss geometric style) ─── */

function PlayIndicator({ visible }: { visible: boolean }) {
  return (
    <div style={{
      position:       "absolute",
      inset:          0,
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
      opacity:        visible ? 0.85 : 0,
      transition:     "opacity 0.25s ease",
      pointerEvents:  "none",
    }}>
      <div style={{
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        width:          44,
        height:         44,
        border:         "1.5px solid rgba(255,255,255,0.8)",
      }}>
        <svg width="11" height="13" viewBox="0 0 9 11" fill="none" aria-hidden>
          <polygon points="1,0 9,5.5 1,11" fill="rgba(255,255,255,0.9)" />
        </svg>
      </div>
    </div>
  );
}

/* ─── Video panel ────────────────────────────────── */

function VideoPanel({
  item,
  accent,
  stripRef,
  srcReady,
  forcePause,
}: {
  item:       VideoItem;
  accent:     string;
  stripRef:   React.RefObject<HTMLDivElement>;
  srcReady:   boolean;
  forcePause: boolean;
}) {
  const videoRef   = useRef<HTMLVideoElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);
  const pauseRef   = useRef(forcePause);
  pauseRef.current = forcePause;

  const [playing, setPlaying] = useState(false);
  const [muted,   setMuted]   = useState(true); // starts muted (required for autoPlay)

  /* Respond immediately when the whole section leaves the viewport */
  useEffect(() => {
    if (forcePause) { videoRef.current?.pause(); setPlaying(false); }
  }, [forcePause]);

  /* Play/pause based on how much of this panel is visible inside the strip.
     Uses IntersectionObserver with the strip scroll container as root so only
     the centred / active panel plays — all others are paused automatically. */
  useEffect(() => {
    const panel = panelRef.current;
    const strip = stripRef.current;
    if (!panel || !strip || !srcReady) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (!video) return;
        if (entry.isIntersecting && !pauseRef.current) {
          video.play().catch(() => {});
          setPlaying(true);
        } else {
          video.pause();
          setPlaying(false);
        }
      },
      { root: strip, threshold: 0.6 },
    );
    obs.observe(panel);
    return () => obs.disconnect();
  }, [srcReady, stripRef]);

  const toggleMute = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <div
      ref={panelRef}
      style={{
        position:        "relative",
        flexShrink:      0,
        width:           "85vw",
        borderRadius:    8,
        background:      accent,
        scrollSnapAlign: "start",
      }}
    >
      {srcReady && (
        <video
          ref={videoRef}
          src={item.src}
          poster={item.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          style={{ display: "block", width: "100%", height: "auto", borderRadius: 8 }}
        />
      )}

      {/* Fix 2 — Square-frame play indicator */}
      {srcReady && <PlayIndicator visible={!playing} />}

      {/* Fix 1 — Mute/unmute toggle, bottom-right, mobile only */}
      {srcReady && (
        <button
          aria-label={muted ? "Unmute video" : "Mute video"}
          onClick={toggleMute}
          style={{
            position:       "absolute",
            bottom:         "0.75rem",
            right:          "0.75rem",
            background:     "rgba(0,0,0,0.55)",
            border:         "none",
            borderRadius:   "50%",
            width:          30,
            height:         30,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            cursor:         "pointer",
            touchAction:    "manipulation",
            zIndex:         2,
          }}
        >
          {muted ? (
            <svg width="12" height="12" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M3 7H7L11 3V17L7 13H3V7Z" fill="#fff"/>
              <line x1="14" y1="7" x2="18" y2="13" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              <line x1="18" y1="7" x2="14" y2="13" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M3 7H7L11 3V17L7 13H3V7Z" fill="#fff"/>
              <path d="M14 8C15 8.8 15.5 9.4 15.5 10C15.5 10.6 15 11.2 14 12" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16.5 5.5C18.5 7 19.5 8.4 19.5 10C19.5 11.6 18.5 13 16.5 14.5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      )}
    </div>
  );
}

/* ─── Image panel ────────────────────────────────── */

function ImagePanel({
  item,
  accent,
}: {
  item:   ImageItem;
  accent: string;
}) {
  return (
    /* Fix 3 — alignSelf: center so landscape image panels are vertically
       centred in the strip row when alongside taller portrait video panels */
    <div
      style={{
        alignSelf:       "center",
        flexShrink:      0,
        width:           "85vw",
        borderRadius:    8,
        background:      accent,
        scrollSnapAlign: "start",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.src}
        alt={item.alt}
        loading="lazy"
        decoding="async"
        style={{ display: "block", width: "100%", height: "auto", borderRadius: 8 }}
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
      />
    </div>
  );
}

/* ─── Strip ─────────────────────────────────────── */

export function MobileProjectStrip({ project }: { project: Project }) {
  const items      = buildMediaItems(project);
  const stripRef   = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [srcReady,  setSrcReady]  = useState(false);
  const [offScreen, setOffScreen] = useState(false);

  /* Lazy-load: inject src only when this section is within 500 px of viewport */
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setSrcReady(true); obs.disconnect(); } },
      { rootMargin: "500px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* Pause all panels when the section scrolls off screen */
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setOffScreen(!entry.isIntersecting),
      { threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (items.length === 0) return null;

  return (
    <div ref={wrapperRef} style={{ padding: "clamp(1rem, 2vh, 1.5rem) 0 clamp(1.5rem, 3vh, 2rem)" }}>

      {/* Swipe hint */}
      <div style={{
        fontFamily:    FONT_BRIER,
        fontSize:      "0.55rem",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color:         "#888",
        paddingLeft:   "5vw",
        marginBottom:  "0.75rem",
      }}>
        ← swipe →
      </div>

      {/*
       * Horizontal scroll strip.
       * - scrollSnapType: x mandatory + scrollSnapAlign: start on panels
       *   gives native snap-to-panel behaviour.
       * - scrollPaddingLeft aligns the snap point so panels start at the
       *   5 vw inset, leaving a 10 vw peek of the next panel.
       * - .strip-scroll in globals.css hides the webkit scrollbar.
       */}
      <div
        ref={stripRef}
        className="strip-scroll"
        style={{
          display:                 "flex",
          flexDirection:           "row",
          alignItems:              "flex-start",
          gap:                     "3vw",
          overflowX:               "auto",
          scrollSnapType:          "x mandatory",
          scrollPaddingLeft:       "5vw",
          WebkitOverflowScrolling: "touch",
          paddingLeft:             "5vw",
          paddingRight:            "5vw",
          paddingBottom:           "0.5rem",
          scrollbarWidth:          "none",
        } as React.CSSProperties}
      >
        {items.map((item, i) =>
          item.kind === "video" ? (
            <VideoPanel
              key={i}
              item={item}
              accent={project.accent}
              stripRef={stripRef as React.RefObject<HTMLDivElement>}
              srcReady={srcReady}
              forcePause={offScreen}
            />
          ) : (
            <ImagePanel
              key={i}
              item={item}
              accent={project.accent}
            />
          ),
        )}
      </div>
    </div>
  );
}

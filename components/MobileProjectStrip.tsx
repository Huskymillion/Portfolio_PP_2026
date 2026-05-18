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

  /* Respond immediately when the whole section leaves the viewport */
  useEffect(() => {
    if (forcePause) videoRef.current?.pause();
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
        } else {
          video.pause();
        }
      },
      { root: strip, threshold: 0.6 },
    );
    obs.observe(panel);
    return () => obs.disconnect();
  }, [srcReady, stripRef]);

  return (
    <div
      ref={panelRef}
      style={{
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
          style={{ display: "block", width: "100%", height: "auto" }}
        />
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
    <div
      style={{
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
        style={{ display: "block", width: "100%", height: "auto" }}
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

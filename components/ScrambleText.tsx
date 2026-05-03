"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>[]{}|^~";

const rand = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
const scramble = (str: string) => str.split("").map((c) => (c === " " ? " " : rand())).join("");

interface Props {
  text:      string;
  isActive?: boolean;       // hero mouse-move mode: overrides per-word hover
  className?: string;
  style?:    React.CSSProperties;
}

export function ScrambleText({ text, isActive, className, style }: Props) {
  const [display, setDisplay] = useState(text);
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { setMounted(true); setDisplay(scramble(text)); }, [text]);
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  const clear = () => { if (timer.current) clearInterval(timer.current); };

  const reveal = useCallback(() => {
    clear();
    let frame = 0;
    const total = 16;
    timer.current = setInterval(() => {
      frame++;
      const p = frame / total;
      setDisplay(text.split("").map((c, i) => (c === " " || i / text.length < p) ? c : rand()).join(""));
      if (frame >= total) { clear(); setDisplay(text); }
    }, 22);
  }, [text]);

  const conceal = useCallback(() => {
    clear();
    let frame = 0;
    timer.current = setInterval(() => {
      frame++;
      setDisplay(scramble(text));
      if (frame >= 8) clear();
    }, 45);
  }, [text]);

  // External control (hero mouse-move): fires when isActive changes
  useEffect(() => {
    if (!mounted || isActive === undefined) return;
    if (isActive) reveal(); else conceal();
  }, [isActive, mounted]); // eslint-disable-line react-hooks/exhaustive-deps

  // Determine blur: external when isActive is set, else per-word hover
  const revealed = isActive !== undefined ? isActive : hovered;
  const shouldBlur = mounted && !revealed;

  return (
    <motion.span
      className={className}
      style={{ display: "block", cursor: "default", ...style }}
      animate={{ filter: shouldBlur ? "blur(4px)" : "blur(0px)", opacity: mounted ? 1 : 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onMouseEnter={isActive === undefined ? () => { setHovered(true); reveal(); } : undefined}
      onMouseLeave={isActive === undefined ? () => { setHovered(false); conceal(); } : undefined}
    >
      {display}
    </motion.span>
  );
}

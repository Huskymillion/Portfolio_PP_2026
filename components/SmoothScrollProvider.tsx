"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { LazyMotion, domAnimation } from "framer-motion";
import Lenis from "lenis";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let rafId: number;
    let published = false;
    function raf(time: number) {
      instance.raf(time);
      if (!published) { published = true; setLenis(instance); }   // expose once Lenis is running
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      instance.destroy();
    };
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
    </LazyMotion>
  );
}

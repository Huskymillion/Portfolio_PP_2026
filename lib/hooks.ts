import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

/** Live media-query match. false on the server and during hydration, then the real value. */
export function useMediaQuery(query: string) {
  const subscribe = useCallback((onChange: () => void) => {
    const mq = window.matchMedia(query);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}

const noSubscribe = () => () => {};

/** false on the server and during hydration, true once running in the browser. */
export function useIsClient() {
  return useSyncExternalStore(noSubscribe, () => true, () => false);
}

export function useCanHover() {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

/**
 * One-shot IntersectionObserver — fires once when element enters the viewport
 * (plus optional rootMargin so we can pre-trigger before it's actually visible).
 * Used to lazy-inject video `src` attributes so out-of-view videos never load.
 */
export function useInView(rootMargin = "500px") {
  const ref    = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // fire once only
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}

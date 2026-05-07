import { useEffect, useRef, useState } from "react";

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

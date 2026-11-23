import { useEffect, useRef, useState } from "react";

/** Flips `revealed` to true the first time the element scrolls into view, to trigger entrance animations. */
export function useReveal<T extends Element>(threshold = 0.05) {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(() => typeof IntersectionObserver === "undefined");

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setRevealed(true);
        observer.disconnect();
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, revealed] as const;
}

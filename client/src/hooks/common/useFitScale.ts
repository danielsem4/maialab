import { useEffect, useRef, useState } from "react";

/** Room left for the content below the site header and page title, as a share of the viewport height. */
const VIEWPORT_HEIGHT_SHARE = 0.85;

/**
 * Scale (at most 1) that fits content of `contentWidth`×`contentHeight` pixels into the observed
 * container's width and most of the viewport height, so the whole content is visible without scrolling.
 */
export function useFitScale<T extends HTMLElement>(contentWidth: number, contentHeight: number) {
  const containerRef = useRef<T>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    function update() {
      if (!container) return;
      const byWidth = container.clientWidth / contentWidth;
      const byHeight = (window.innerHeight * VIEWPORT_HEIGHT_SHARE) / contentHeight;
      setScale(Math.min(1, byWidth, byHeight));
    }
    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [contentWidth, contentHeight]);

  return { containerRef, scale };
}

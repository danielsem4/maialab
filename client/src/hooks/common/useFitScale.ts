import { useEffect, useRef, useState } from "react";

/** Room left for the content below the site header and page title, as a share of the viewport height. */
const VIEWPORT_HEIGHT_SHARE = 0.85;

/** Mobile browsers grow the viewport by about this much when their toolbar hides; not worth rescaling for. */
const TOOLBAR_HEIGHT = 60;

function viewportHeight(): number {
  return window.visualViewport?.height ?? window.innerHeight;
}

/**
 * Scale (at most 1) that fits content of `contentWidth`×`contentHeight` pixels into the observed
 * container's width and `heightShare` of the viewport height, so the whole content is visible without scrolling.
 */
export function useFitScale<T extends HTMLElement>(
  contentWidth: number,
  contentHeight: number,
  heightShare = VIEWPORT_HEIGHT_SHARE,
) {
  const containerRef = useRef<T>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let height = viewportHeight();
    function update() {
      if (!container) return;
      // Follow the viewport when it shrinks or really changes, but not when a toolbar slides away mid-scroll.
      const current = viewportHeight();
      if (current < height || current - height >= TOOLBAR_HEIGHT) height = current;
      const byWidth = container.clientWidth / contentWidth;
      const byHeight = (height * heightShare) / contentHeight;
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
  }, [contentWidth, contentHeight, heightShare]);

  return { containerRef, scale };
}

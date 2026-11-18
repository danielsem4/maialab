import { useEffect, useRef, useState } from "react";
import { containScale } from "@/lib/deck/stageGeometry";

/** Scale that fits a whole 1920×1080 slide into the observed container, tracking its size. */
export function useContainScale<T extends HTMLElement>(padding = 0) {
  const containerRef = useRef<T>(null);
  const [scale, setScale] = useState(() => containScale(0, 0, padding));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    function update() {
      if (!container) return;
      setScale(containScale(container.clientWidth, container.clientHeight, padding));
    }
    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => {
      observer.disconnect();
    };
  }, [padding]);

  return { containerRef, scale };
}

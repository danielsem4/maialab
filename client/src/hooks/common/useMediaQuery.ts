import { useSyncExternalStore } from "react";

/** Whether the CSS media query currently matches, kept in sync as the viewport changes. */
export function useMediaQuery(query: string): boolean {
  const subscribe = (onChange: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  };
  const getSnapshot = () => window.matchMedia(query).matches;

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

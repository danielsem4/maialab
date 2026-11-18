import { useRef } from "react";
import type { MouseEvent } from "react";
import { registerTap } from "@/common/utils/secretTap";

interface ISecretTapOptions {
  taps?: number;
  windowMs?: number;
}

/**
 * Returns a click handler that calls `onUnlock` after `taps` clicks within `windowMs`.
 * The unlocking click's default action is prevented so `onUnlock` can navigate elsewhere.
 */
export function useSecretTap(onUnlock: () => void, { taps = 7, windowMs = 20_000 }: ISecretTapOptions = {}) {
  const tapsRef = useRef<number[]>([]);

  const handleTap = (event: MouseEvent) => {
    tapsRef.current = registerTap(tapsRef.current, Date.now(), windowMs);
    if (tapsRef.current.length < taps) return;
    tapsRef.current = [];
    event.preventDefault();
    onUnlock();
  };

  return handleTap;
}

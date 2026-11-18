/** Records a tap at `now`, dropping taps older than `windowMs`. */
export function registerTap(taps: number[], now: number, windowMs: number): number[] {
  return [...taps.filter((tap) => now - tap < windowMs), now];
}

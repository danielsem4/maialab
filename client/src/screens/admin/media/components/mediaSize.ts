/** Size in whole kilobytes (at least 1) for the media.size label. */
export function toKilobytes(bytes: number): number {
  return Math.max(1, Math.round(bytes / 1024));
}

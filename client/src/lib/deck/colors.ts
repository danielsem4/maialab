import type { IDeckTheme } from "@/common/types/Deck";

const THEME_VAR = /^var\(--deck-([\w-]+)\)$/;
const HEX6 = /^#[0-9a-f]{6}$/i;
const HEX3 = /^#[0-9a-f]{3}$/i;
const FALLBACK = "#000000";

/** The value stored on an element that follows a theme colour. */
export function themeColorVar(name: string): string {
  return `var(--deck-${name})`;
}

function toHex6(value: string): string | null {
  if (HEX6.test(value)) return value.toLowerCase();
  if (!HEX3.test(value)) return null;
  const [, r, g, b] = value.toLowerCase();
  return `#${r}${r}${g}${g}${b}${b}`;
}

/** A `#rrggbb` value for `<input type="color">`, which accepts nothing else. */
export function resolveColor(value: string | undefined, theme: IDeckTheme): string {
  if (!value) return FALLBACK;
  const themeName = THEME_VAR.exec(value)?.[1];
  const raw = themeName ? theme.colors[themeName] : value;
  return (raw && toHex6(raw)) ?? FALLBACK;
}

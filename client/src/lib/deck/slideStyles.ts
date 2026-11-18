import type { CSSProperties } from "react";
import type { IDeckElement, IDeckTheme } from "@/common/types/Deck";
import { SLIDE_HEIGHT, SLIDE_WIDTH } from "./deckDoc";

type CssVars = Record<`--${string}`, string>;

const SAFE_NAME = /^[\w-]+$/;

/** Theme colours as `--deck-<name>` and fonts as `--deck-font-heading` / `--deck-font-body`. */
export function themeVars(theme: IDeckTheme): CssVars {
  const vars: CssVars = {};
  for (const [name, value] of Object.entries(theme.colors)) {
    if (SAFE_NAME.test(name)) vars[`--deck-${name}`] = value;
  }
  vars["--deck-font-heading"] = theme.fontHeading;
  vars["--deck-font-body"] = theme.fontBody;
  return vars;
}

/** A theme font with a sans-serif fallback, for when the named font is not installed or loaded. */
export function fontStack(kind: "heading" | "body"): string {
  return `var(--deck-font-${kind}), system-ui, sans-serif`;
}

/** Style for a slide's root at its natural 1920×1080 size; callers scale it with a CSS transform. */
export function slideSurfaceStyle(theme: IDeckTheme, background?: string): CSSProperties {
  return {
    ...themeVars(theme),
    position: "relative",
    width: SLIDE_WIDTH,
    height: SLIDE_HEIGHT,
    overflow: "hidden",
    background: background ?? "var(--deck-background)",
    fontFamily: fontStack("body"),
  };
}

export function elementBoxStyle(element: Pick<IDeckElement, "x" | "y" | "w" | "h" | "rotation">): CSSProperties {
  return {
    position: "absolute",
    left: element.x,
    top: element.y,
    width: element.w,
    height: element.h,
    transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
  };
}

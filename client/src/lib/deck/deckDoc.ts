import type { IDeckDoc, ISlide } from "@/common/types/Deck";

export const SLIDE_WIDTH = 1920;
export const SLIDE_HEIGHT = 1080;
export const MIN_ELEMENT_SIZE = 20;

export function newId(): string {
  return crypto.randomUUID();
}

export function createSlide(): ISlide {
  return { id: newId(), transition: "none", elements: [] };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Shape-checks a document loaded from the server. Returns null when the editor cannot safely open it.
 * Element types are deliberately not checked: unknown ones are kept as-is so a save never drops them.
 */
export function parseDeckDoc(value: unknown): IDeckDoc | null {
  if (!isRecord(value) || value.version !== 1) return null;
  if (!Array.isArray(value.slides) || value.slides.length === 0) return null;
  const slidesOk = value.slides.every((slide) => isRecord(slide) && Array.isArray(slide.elements));
  return slidesOk ? (value as unknown as IDeckDoc) : null;
}

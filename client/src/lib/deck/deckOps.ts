import type { IDeckDoc, IDeckElement, ISlide } from "@/common/types/Deck";
import { createSlide, newId } from "./deckDoc";

// Every function here returns a NEW document and never mutates its input. When nothing changes the
// input itself is returned, which the editor store uses to skip the undo-history entry.

export type LayerMove = "forward" | "backward" | "front" | "back";

const DUPLICATE_OFFSET = 40;

function mapSlide(doc: IDeckDoc, slideId: string, fn: (slide: ISlide) => ISlide): IDeckDoc {
  let changed = false;
  const slides = doc.slides.map((slide) => {
    if (slide.id !== slideId) return slide;
    const next = fn(slide);
    if (next !== slide) changed = true;
    return next;
  });
  return changed ? { ...doc, slides } : doc;
}

function insertAfter(doc: IDeckDoc, slide: ISlide, afterSlideId?: string): IDeckDoc {
  const index = doc.slides.findIndex((s) => s.id === afterSlideId);
  const at = index === -1 ? doc.slides.length : index + 1;
  return { ...doc, slides: [...doc.slides.slice(0, at), slide, ...doc.slides.slice(at)] };
}

export function addSlide(doc: IDeckDoc, afterSlideId?: string): { doc: IDeckDoc; slideId: string } {
  const slide = createSlide();
  return { doc: insertAfter(doc, slide, afterSlideId), slideId: slide.id };
}

export function duplicateSlide(doc: IDeckDoc, slideId: string): { doc: IDeckDoc; slideId: string } {
  const source = doc.slides.find((s) => s.id === slideId);
  if (!source) return { doc, slideId };
  const copy: ISlide = {
    ...structuredClone(source),
    id: newId(),
    elements: source.elements.map((el) => ({ ...structuredClone(el), id: newId() })),
  };
  return { doc: insertAfter(doc, copy, slideId), slideId: copy.id };
}

export function removeSlide(doc: IDeckDoc, slideId: string): IDeckDoc {
  if (doc.slides.length <= 1 || !doc.slides.some((s) => s.id === slideId)) return doc;
  return { ...doc, slides: doc.slides.filter((s) => s.id !== slideId) };
}

export function reorderSlides(doc: IDeckDoc, slideIds: string[]): IDeckDoc {
  const byId = new Map(doc.slides.map((s) => [s.id, s]));
  const ordered = slideIds.flatMap((id) => byId.get(id) ?? []);
  const rest = doc.slides.filter((s) => !slideIds.includes(s.id));
  return { ...doc, slides: [...ordered, ...rest] };
}

export function updateSlide(
  doc: IDeckDoc,
  slideId: string,
  patch: Partial<Pick<ISlide, "background" | "transition">>,
): IDeckDoc {
  return mapSlide(doc, slideId, (slide) => ({ ...slide, ...patch }));
}

export function addElement(doc: IDeckDoc, slideId: string, element: IDeckElement): IDeckDoc {
  return mapSlide(doc, slideId, (slide) => ({ ...slide, elements: [...slide.elements, element] }));
}

export function updateElement(
  doc: IDeckDoc,
  slideId: string,
  elementId: string,
  patch: Partial<Omit<IDeckElement, "id" | "type">>,
): IDeckDoc {
  return mapSlide(doc, slideId, (slide) => {
    if (!slide.elements.some((el) => el.id === elementId)) return slide;
    const elements = slide.elements.map((el) =>
      el.id === elementId ? { ...el, ...patch, props: { ...el.props, ...patch.props } } : el,
    );
    return { ...slide, elements };
  });
}

export function removeElements(doc: IDeckDoc, slideId: string, elementIds: string[]): IDeckDoc {
  return mapSlide(doc, slideId, (slide) => {
    const elements = slide.elements.filter((el) => !elementIds.includes(el.id));
    return elements.length === slide.elements.length ? slide : { ...slide, elements };
  });
}

export function duplicateElements(
  doc: IDeckDoc,
  slideId: string,
  elementIds: string[],
): { doc: IDeckDoc; newIds: string[] } {
  const newIds: string[] = [];
  const next = mapSlide(doc, slideId, (slide) => {
    const copies = slide.elements
      .filter((el) => elementIds.includes(el.id))
      .map((el) => ({ ...structuredClone(el), id: newId(), x: el.x + DUPLICATE_OFFSET, y: el.y + DUPLICATE_OFFSET }));
    if (copies.length === 0) return slide;
    newIds.push(...copies.map((c) => c.id));
    return { ...slide, elements: [...slide.elements, ...copies] };
  });
  return { doc: next, newIds };
}

function targetIndex(move: LayerMove, from: number, last: number): number {
  if (move === "front") return last;
  if (move === "back") return 0;
  return Math.min(last, Math.max(0, from + (move === "forward" ? 1 : -1)));
}

export function moveLayer(doc: IDeckDoc, slideId: string, elementId: string, move: LayerMove): IDeckDoc {
  return mapSlide(doc, slideId, (slide) => {
    const from = slide.elements.findIndex((el) => el.id === elementId);
    if (from === -1) return slide;
    const to = targetIndex(move, from, slide.elements.length - 1);
    if (to === from) return slide;
    const elements = slide.elements.filter((el) => el.id !== elementId);
    elements.splice(to, 0, slide.elements[from]);
    return { ...slide, elements };
  });
}

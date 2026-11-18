import { describe, expect, it } from "vitest";
import type { IDeckDoc, IDeckElement } from "@/common/types/Deck";
import {
  addElement,
  addSlide,
  duplicateElements,
  duplicateSlide,
  moveLayer,
  removeElements,
  removeSlide,
  reorderSlides,
  updateElement,
  updateSlide,
} from "./deckOps";

const theme = { colors: {}, fontHeading: "Inter", fontBody: "Inter" };

function element(id: string): IDeckElement {
  return { id, type: "shape", x: 10, y: 20, w: 100, h: 50, rotation: 0, props: { fill: "#fff", radius: 4 } };
}

function makeDoc(): IDeckDoc {
  return {
    version: 1,
    theme,
    slides: [
      { id: "s1", transition: "none", elements: [element("a"), element("b"), element("c")] },
      { id: "s2", transition: "fade", elements: [] },
    ],
  };
}

const oneSlideDoc: IDeckDoc = { version: 1, theme, slides: [{ id: "s1", transition: "none", elements: [] }] };

function ids(doc: IDeckDoc): string[] {
  return doc.slides[0].elements.map((e) => e.id);
}

/** Runs an op and asserts the input document was left untouched. */
function pure<T>(op: (doc: IDeckDoc) => T): T {
  const doc = makeDoc();
  const before = structuredClone(doc);
  const result = op(doc);
  expect(doc).toEqual(before);
  return result;
}

describe("slides", () => {
  it("adds a slide at the end, or after a given slide", () => {
    const end = pure((d) => addSlide(d));
    expect(end.doc.slides.map((s) => s.id)).toEqual(["s1", "s2", end.slideId]);
    const after = pure((d) => addSlide(d, "s1"));
    expect(after.doc.slides.map((s) => s.id)).toEqual(["s1", after.slideId, "s2"]);
  });

  it("duplicates a slide directly after the original with new ids", () => {
    const doc = makeDoc();
    const dup = pure((d) => duplicateSlide(d, "s1"));
    expect(dup.doc.slides).toHaveLength(3);
    expect(dup.doc.slides[1].id).toBe(dup.slideId);
    expect(dup.slideId).not.toBe("s1");
    expect(dup.doc.slides[1].elements[0].id).not.toBe(doc.slides[0].elements[0].id);
    expect(dup.doc.slides[1].elements[0].props).toEqual(doc.slides[0].elements[0].props);
  });

  it("removes a slide but never the last one", () => {
    expect(pure((d) => removeSlide(d, "s2")).slides.map((s) => s.id)).toEqual(["s1"]);
    expect(removeSlide(oneSlideDoc, "s1")).toEqual(oneSlideDoc);
  });

  it("reorders slides and keeps slides missing from the list", () => {
    expect(pure((d) => reorderSlides(d, ["s2", "s1"])).slides.map((s) => s.id)).toEqual(["s2", "s1"]);
    expect(pure((d) => reorderSlides(d, ["s2", "ghost"])).slides.map((s) => s.id)).toEqual(["s2", "s1"]);
  });

  it("updates slide settings", () => {
    const next = pure((d) => updateSlide(d, "s1", { background: "#000", transition: "slide" }));
    expect(next.slides[0]).toMatchObject({ background: "#000", transition: "slide" });
  });
});

describe("elements", () => {
  it("adds an element on top", () => {
    expect(ids(pure((d) => addElement(d, "s1", element("z"))))).toEqual(["a", "b", "c", "z"]);
  });

  it("shallow-merges props on update", () => {
    const doc = makeDoc();
    const next = pure((d) => updateElement(d, "s1", "a", { x: 99, props: { fill: "#000" } }));
    expect(next.slides[0].elements[0].x).toBe(99);
    expect(next.slides[0].elements[0].props).toEqual({ ...doc.slides[0].elements[0].props, fill: "#000" });
  });

  it("returns the same document when the target is missing", () => {
    const doc = makeDoc();
    expect(updateElement(doc, "s1", "missing", { x: 5 })).toBe(doc);
    expect(updateElement(doc, "nope", "a", { x: 5 })).toBe(doc);
    expect(updateElement(doc, "s1", "missing", { x: 5 })).toEqual(doc);
  });

  it("removes elements", () => {
    expect(ids(pure((d) => removeElements(d, "s1", ["a", "c"])))).toEqual(["b"]);
  });

  it("duplicates elements on top, offset by 40", () => {
    const dup = pure((d) => duplicateElements(d, "s1", ["a", "b"]));
    expect(dup.newIds).toHaveLength(2);
    expect(ids(dup.doc)).toEqual(["a", "b", "c", ...dup.newIds]);
    expect(dup.doc.slides[0].elements[3]).toMatchObject({ x: 50, y: 60, w: 100, h: 50 });
  });
});

describe("moveLayer", () => {
  it("moves one step or all the way", () => {
    expect(ids(pure((d) => moveLayer(d, "s1", "a", "forward")))).toEqual(["b", "a", "c"]);
    expect(ids(pure((d) => moveLayer(d, "s1", "a", "front")))).toEqual(["b", "c", "a"]);
    expect(ids(pure((d) => moveLayer(d, "s1", "c", "back")))).toEqual(["c", "a", "b"]);
    expect(ids(pure((d) => moveLayer(d, "s1", "c", "backward")))).toEqual(["a", "c", "b"]);
  });

  it("does nothing at the ends of the stack", () => {
    const doc = makeDoc();
    expect(ids(moveLayer(doc, "s1", "c", "forward"))).toEqual(["a", "b", "c"]);
    expect(moveLayer(doc, "s1", "c", "forward")).toBe(doc);
    expect(moveLayer(doc, "s1", "a", "back")).toBe(doc);
  });
});

import { describe, expect, it } from "vitest";
import { createSlide, newId, parseDeckDoc } from "./deckDoc";

const theme = { colors: { background: "#fff" }, fontHeading: "Inter", fontBody: "Inter" };

describe("parseDeckDoc", () => {
  it("rejects an unknown version", () => {
    expect(parseDeckDoc({ version: 2, slides: [] })).toBeNull();
  });

  it("rejects a deck without slides", () => {
    expect(parseDeckDoc({ version: 1, theme, slides: [] })).toBeNull();
    expect(parseDeckDoc({ version: 1, theme, slides: "nope" })).toBeNull();
  });

  it("rejects a slide without an elements array", () => {
    expect(parseDeckDoc({ version: 1, theme, slides: [{ id: "s", transition: "none" }] })).toBeNull();
  });

  it("rejects values that are not objects", () => {
    expect(parseDeckDoc(null)).toBeNull();
    expect(parseDeckDoc("deck")).toBeNull();
    expect(parseDeckDoc([])).toBeNull();
  });

  it("keeps element types it does not know", () => {
    const future = {
      version: 1,
      theme,
      slides: [
        {
          id: "s",
          transition: "none",
          elements: [{ id: "e", type: "hologram", x: 0, y: 0, w: 10, h: 10, rotation: 0, props: { a: 1 } }],
        },
      ],
    };
    expect(parseDeckDoc(future)).toEqual(future);
  });
});

describe("createSlide", () => {
  it("creates an empty slide with a fresh id", () => {
    const a = createSlide();
    const b = createSlide();
    expect(a).toMatchObject({ transition: "none", elements: [] });
    expect(a.id).not.toBe(b.id);
  });
});

describe("newId", () => {
  it("returns unique ids", () => {
    expect(newId()).not.toBe(newId());
  });
});

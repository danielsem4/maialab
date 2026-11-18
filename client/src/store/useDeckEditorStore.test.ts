import { beforeEach, describe, expect, it } from "vitest";
import type { IDeck, IDeckElement } from "@/common/types/Deck";
import { addElement, removeElements } from "@/lib/deck/deckOps";
import { selectCurrentSlide, useDeckEditorStore } from "./useDeckEditorStore";

const element: IDeckElement = { id: "e1", type: "shape", x: 0, y: 0, w: 100, h: 100, rotation: 0, props: {} };

function makeDeck(): IDeck {
  return {
    id: 7,
    title: "Deck",
    isTemplate: false,
    slideCount: 2,
    updatedAt: "2026-01-01T00:00:00.000Z",
    doc: {
      version: 1,
      theme: { colors: {}, fontHeading: "Inter", fontBody: "Inter" },
      slides: [
        { id: "s1", transition: "none", elements: [] },
        { id: "s2", transition: "none", elements: [] },
      ],
    },
  };
}

const store = () => useDeckEditorStore.getState();
const history = () => useDeckEditorStore.temporal.getState();
const slideIds = () => store().doc!.slides.map((s) => s.id);

describe("useDeckEditorStore", () => {
  beforeEach(() => {
    store().reset();
    store().load(makeDeck());
  });

  it("loads a deck with a clean history", () => {
    expect(store().deckId).toBe(7);
    expect(store().title).toBe("Deck");
    expect(store().currentSlideId).toBe("s1");
    expect(history().pastStates).toHaveLength(0);
    expect(selectCurrentSlide(store())?.id).toBe("s1");
  });

  it("records one history entry per change and none for a no-op", () => {
    store().apply((d) => d);
    expect(history().pastStates).toHaveLength(0);
    store().apply((d) => addElement(d, "s1", element));
    expect(history().pastStates).toHaveLength(1);
  });

  it("does not record selection or title changes", () => {
    store().select(["x"]);
    store().setTitle("Renamed");
    store().selectSlide("s2");
    store().setEditingText("x");
    expect(history().pastStates).toHaveLength(0);
  });

  it("adds a slide after the current one and selects it", () => {
    store().addSlide();
    const added = store().currentSlideId!;
    expect(slideIds()).toEqual(["s1", added, "s2"]);
    history().undo();
    expect(slideIds()).toEqual(["s1", "s2"]);
    expect(slideIds()).toContain(store().currentSlideId);
    history().redo();
    expect(slideIds()).toHaveLength(3);
  });

  it("duplicates a slide and selects the copy", () => {
    store().duplicateSlide("s1");
    expect(slideIds()).toHaveLength(3);
    expect(store().currentSlideId).toBe(slideIds()[1]);
  });

  it("moves to the neighbour when the current slide is removed", () => {
    store().apply((d) => addElement(d, "s1", element));
    store().select(["e1"]);
    store().removeSlide("s1");
    expect(slideIds()).toEqual(["s2"]);
    expect(store().currentSlideId).toBe("s2");
    expect(store().selectedIds).toEqual([]);
    store().removeSlide("s2");
    expect(slideIds()).toEqual(["s2"]);
  });

  it("clears the selection when switching slides", () => {
    store().apply((d) => addElement(d, "s1", element));
    store().select(["e1"]);
    store().setEditingText("e1");
    store().selectSlide("s2");
    expect(store().selectedIds).toEqual([]);
    expect(store().editingTextId).toBeNull();
  });

  it("drops selected elements that an undo removed", () => {
    store().apply((d) => addElement(d, "s1", element));
    store().select(["e1"]);
    history().undo();
    expect(store().selectedIds).toEqual([]);
    history().redo();
    store().select(["e1"]);
    store().apply((d) => removeElements(d, "s1", ["e1"]));
    expect(store().selectedIds).toEqual([]);
  });

  it("reorders slides", () => {
    store().reorderSlides(["s2", "s1"]);
    expect(slideIds()).toEqual(["s2", "s1"]);
    expect(store().currentSlideId).toBe("s1");
  });

  it("resets to an empty editor", () => {
    store().reset();
    expect(store().doc).toBeNull();
    expect(store().deckId).toBeNull();
    expect(history().pastStates).toHaveLength(0);
    store().apply((d) => d);
    store().addSlide();
    expect(store().doc).toBeNull();
  });
});

import { create } from "zustand";
import { temporal } from "zundo";
import type { IDeck, IDeckDoc, ISlide } from "@/common/types/Deck";
import * as ops from "@/lib/deck/deckOps";

// Editor state for the deck that is open. Never persisted: the server copy is the source of truth.

export interface DeckEditorState {
  deckId: number | null;
  title: string;
  doc: IDeckDoc | null;
  currentSlideId: string | null;
  selectedIds: string[];
  editingTextId: string | null;
  load(deck: IDeck): void;
  reset(): void;
  setTitle(title: string): void;
  selectSlide(id: string): void;
  select(ids: string[]): void;
  setEditingText(id: string | null): void;
  /** The ONLY way the doc changes. No-op (no undo entry) when `op` returns the same reference. */
  apply(op: (doc: IDeckDoc) => IDeckDoc): void;
  addSlide(): void;
  duplicateSlide(id: string): void;
  removeSlide(id: string): void;
  reorderSlides(ids: string[]): void;
}

const EMPTY = { deckId: null, title: "", doc: null, currentSlideId: null, selectedIds: [], editingTextId: null };
const NO_SELECTION = { selectedIds: [], editingTextId: null };

export const useDeckEditorStore = create<DeckEditorState>()(
  temporal(
    (set, get) => ({
      ...EMPTY,

      load(deck) {
        set({ ...EMPTY, deckId: deck.id, title: deck.title, doc: deck.doc, currentSlideId: deck.doc.slides[0].id });
        useDeckEditorStore.temporal.getState().clear();
      },

      reset() {
        set(EMPTY);
        useDeckEditorStore.temporal.getState().clear();
      },

      setTitle: (title) => set({ title }),
      selectSlide: (id) => set({ currentSlideId: id, ...NO_SELECTION }),
      select: (ids) => set({ selectedIds: ids }),
      setEditingText: (id) => set({ editingTextId: id }),

      apply(op) {
        const { doc } = get();
        if (!doc) return;
        const next = op(doc);
        if (next !== doc) set({ doc: next });
      },

      addSlide() {
        const { doc, currentSlideId } = get();
        if (!doc) return;
        const result = ops.addSlide(doc, currentSlideId ?? undefined);
        set({ doc: result.doc, currentSlideId: result.slideId, ...NO_SELECTION });
      },

      duplicateSlide(id) {
        const { doc } = get();
        if (!doc) return;
        const result = ops.duplicateSlide(doc, id);
        if (result.doc !== doc) set({ doc: result.doc, currentSlideId: result.slideId, ...NO_SELECTION });
      },

      removeSlide(id) {
        const { doc, currentSlideId } = get();
        if (!doc) return;
        const next = ops.removeSlide(doc, id);
        if (next === doc) return;
        if (id !== currentSlideId) return set({ doc: next });
        const index = doc.slides.findIndex((s) => s.id === id);
        const neighbour = doc.slides[index + 1] ?? doc.slides[index - 1];
        set({ doc: next, currentSlideId: neighbour.id, ...NO_SELECTION });
      },

      reorderSlides: (ids) => get().apply((doc) => ops.reorderSlides(doc, ids)),
    }),
    {
      partialize: (state) => ({ doc: state.doc }),
      // Without this every set() — selection, title — would land in the undo history.
      equality: (past, current) => past.doc === current.doc,
      limit: 100,
    },
  ),
);

export function selectCurrentSlide(state: DeckEditorState): ISlide | null {
  return state.doc?.slides.find((slide) => slide.id === state.currentSlideId) ?? null;
}

// Selection invariants after ANY doc change, undo and redo included: the current slide must exist,
// and nothing that no longer exists may stay selected or in text-edit mode.
useDeckEditorStore.subscribe((state) => {
  if (!state.doc) return;
  const slide = selectCurrentSlide(state);
  if (!slide) {
    useDeckEditorStore.setState({ currentSlideId: state.doc.slides[0].id, ...NO_SELECTION });
    return;
  }
  const selectedIds = state.selectedIds.filter((id) => slide.elements.some((el) => el.id === id));
  const editingGone = state.editingTextId !== null && !slide.elements.some((el) => el.id === state.editingTextId);
  if (selectedIds.length !== state.selectedIds.length || editingGone) {
    useDeckEditorStore.setState({ selectedIds, editingTextId: editingGone ? null : state.editingTextId });
  }
});

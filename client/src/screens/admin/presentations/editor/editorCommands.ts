import type { IDeckDoc, IDeckElement, ISlide } from "@/common/types/Deck";
import type { IMedia } from "@/common/types/Media";
import type { IPoint } from "@/common/utils/geometry";
import { createElementOfType, createImageElement } from "@/components/deck/elements/registry";
import * as ops from "@/lib/deck/deckOps";
import type { EditorCommand } from "@/lib/deck/shortcuts";
import { clampElement, finalizeFrame, type IFrame } from "@/lib/deck/stageGeometry";
import { selectCurrentSlide, useDeckEditorStore } from "@/store/useDeckEditorStore";

// Editor actions on the current slide and selection, shared by buttons, shortcuts and stage gestures.
// They read the store at call time, so they are safe to call from event handlers anywhere.

const editor = () => useDeckEditorStore.getState();
const history = () => useDeckEditorStore.temporal.getState();

/** Runs `change` against the current slide as ONE undo step. */
function onCurrentSlide(change: (doc: IDeckDoc, slide: ISlide) => IDeckDoc): void {
  const slide = selectCurrentSlide(editor());
  if (slide) editor().apply((doc) => change(doc, slide));
}

function addAndSelect(element: IDeckElement | null): void {
  if (!element) return;
  onCurrentSlide((doc, slide) => ops.addElement(doc, slide.id, element));
  editor().select([element.id]);
}

export function insertElement(type: string, center?: IPoint): void {
  addAndSelect(createElementOfType(type, center));
}

export function insertImage(media: IMedia, center?: IPoint): void {
  addAndSelect(createImageElement(media, center));
}

export function deleteSelection(): void {
  const ids = editor().selectedIds;
  onCurrentSlide((doc, slide) => ops.removeElements(doc, slide.id, ids));
}

export function deleteElement(elementId: string): void {
  onCurrentSlide((doc, slide) => ops.removeElements(doc, slide.id, [elementId]));
}

export function duplicateSelection(): void {
  let newIds: string[] = [];
  const ids = editor().selectedIds;
  onCurrentSlide((doc, slide) => {
    const result = ops.duplicateElements(doc, slide.id, ids);
    newIds = result.newIds;
    return result.doc;
  });
  if (newIds.length > 0) editor().select(newIds);
}

export function nudgeSelection(dx: number, dy: number): void {
  const ids = editor().selectedIds;
  onCurrentSlide((doc, slide) =>
    slide.elements
      .filter((el) => ids.includes(el.id))
      .reduce((next, el) => {
        const { x, y } = clampElement({ x: el.x + dx, y: el.y + dy, w: el.w, h: el.h });
        return x === el.x && y === el.y ? next : ops.updateElement(next, slide.id, el.id, { x, y });
      }, doc),
  );
}

export function moveSelectionLayer(move: ops.LayerMove): void {
  const [id, ...others] = editor().selectedIds;
  if (id && others.length === 0) onCurrentSlide((doc, slide) => ops.moveLayer(doc, slide.id, id, move));
}

export function updateElementProps(elementId: string, props: Record<string, unknown>): void {
  onCurrentSlide((doc, slide) => ops.updateElement(doc, slide.id, elementId, { props }));
}

/** Stores new geometry for several elements at once (one gesture = one undo step); unchanged ones are skipped. */
export function commitFrames(frames: Map<string, IFrame>): void {
  onCurrentSlide((doc, slide) =>
    slide.elements.reduce((next, el) => {
      const frame = frames.get(el.id);
      if (!frame) return next;
      const final = finalizeFrame(frame);
      const same =
        final.x === el.x && final.y === el.y && final.w === el.w && final.h === el.h && final.rotation === el.rotation;
      return same ? next : ops.updateElement(next, slide.id, el.id, final);
    }, doc),
  );
}

export function setSlideBackground(background: string | undefined): void {
  onCurrentSlide((doc, slide) =>
    slide.background === background ? doc : ops.updateSlide(doc, slide.id, { background }),
  );
}

export function runEditorCommand(command: EditorCommand): void {
  switch (command.kind) {
    case "delete":
      return deleteSelection();
    case "duplicate":
      return duplicateSelection();
    case "undo":
      return history().undo();
    case "redo":
      return history().redo();
    case "nudge":
      return nudgeSelection(command.dx, command.dy);
    case "layer":
      return moveSelectionLayer(command.move);
    case "deselect":
      return editor().select([]);
  }
}

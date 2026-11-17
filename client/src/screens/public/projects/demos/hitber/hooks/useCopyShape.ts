import { isInsideRect } from "@/common/utils/geometry";
import { arrangementMatches } from "@/common/utils/hitberUtils";
import { useDraggables } from "../../hooks/useDraggables";
import {
  ARRANGEMENT_TOLERANCE,
  MODEL_POSITIONS,
  PIECE_IDS,
  START_POSITIONS,
  TARGET_CARD_RECT,
  type PieceId,
} from "../components/housePieces";

/**
 * Drag the house pieces freely onto the blank card. Passes when every piece sits on the card and the
 * pieces form the same arrangement as the model (compared relative to each other, not to fixed slots).
 */
export function useCopyShape(onComplete: (passed: boolean) => void) {
  const draggables = useDraggables<PieceId>(START_POSITIONS);

  function handleDone() {
    const { positions } = draggables;
    const onCard = PIECE_IDS.every((id) => isInsideRect(positions[id], TARGET_CARD_RECT));
    onComplete(onCard && arrangementMatches(positions, MODEL_POSITIONS, ARRANGEMENT_TOLERANCE));
  }

  return { ...draggables, handleDone };
}

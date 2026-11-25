import { useState } from "react";
import type { BodySelection, BodySide } from "@/common/types/Tens";
import { countSelectedAreas, regionsForSide, toggleArea } from "@/common/utils/tensUtils";
import { BODY_REGIONS } from "../tensData";

/** The pain map's state: which side is showing, which region's dialog is open, and the chosen areas. */
export function useBodyMap() {
  const [side, setSide] = useState<BodySide>("front");
  const [openRegionId, setOpenRegionId] = useState<string | null>(null);
  const [selection, setSelection] = useState<BodySelection>({});

  function flip() {
    setSide(side === "front" ? "back" : "front");
  }

  function closeDialog() {
    setOpenRegionId(null);
  }

  function toggleOpenArea(areaId: string) {
    if (openRegionId) setSelection(toggleArea(selection, openRegionId, areaId));
  }

  return {
    side,
    regions: regionsForSide(BODY_REGIONS, side),
    openRegion: BODY_REGIONS.find((region) => region.id === openRegionId) ?? null,
    selection,
    selectedCount: countSelectedAreas(selection),
    flip,
    openDialog: setOpenRegionId,
    closeDialog,
    toggleOpenArea,
  };
}

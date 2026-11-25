import type { BodySelection, BodySide, IBodyRegion } from "@/common/types/Tens";
import { toggleInList } from "./listUtils";

export function regionsForSide(regions: IBodyRegion[], side: BodySide): IBodyRegion[] {
  return regions.filter((region) => region.side === side);
}

/** Toggles one area of a region, leaving the other regions untouched. */
export function toggleArea(selection: BodySelection, regionId: string, areaId: string): BodySelection {
  return { ...selection, [regionId]: toggleInList(selection[regionId] ?? [], areaId) };
}

/** Total chosen areas across every region, on both sides of the body. */
export function countSelectedAreas(selection: BodySelection): number {
  return Object.values(selection).reduce((total, areas) => total + areas.length, 0);
}

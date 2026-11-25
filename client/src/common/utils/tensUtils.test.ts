import { describe, expect, it } from "vitest";
import type { IBodyRegion } from "@/common/types/Tens";
import { countSelectedAreas, regionsForSide, toggleArea } from "./tensUtils";

describe("regionsForSide", () => {
  const regions: IBodyRegion[] = [
    { id: "head", side: "front", x: 0, y: 0, areas: [] },
    { id: "neck", side: "back", x: 0, y: 0, areas: [] },
    { id: "chest", side: "front", x: 0, y: 0, areas: [] },
  ];

  it("keeps only the regions of that side, in order", () => {
    expect(regionsForSide(regions, "front").map((region) => region.id)).toEqual(["head", "chest"]);
    expect(regionsForSide(regions, "back").map((region) => region.id)).toEqual(["neck"]);
  });
});

describe("toggleArea", () => {
  it("starts a region's list on the first pick", () => {
    expect(toggleArea({}, "head", "jaw")).toEqual({ head: ["jaw"] });
  });

  it("toggles within one region and leaves the others alone", () => {
    const selection = { head: ["jaw", "eyes"], neck: ["nape"] };
    expect(toggleArea(selection, "head", "jaw")).toEqual({ head: ["eyes"], neck: ["nape"] });
  });
});

describe("countSelectedAreas", () => {
  it("is zero for an empty selection or emptied regions", () => {
    expect(countSelectedAreas({})).toBe(0);
    expect(countSelectedAreas({ head: [] })).toBe(0);
  });

  it("sums the areas of every region", () => {
    expect(countSelectedAreas({ head: ["jaw", "eyes"], neck: ["nape"] })).toBe(3);
  });
});

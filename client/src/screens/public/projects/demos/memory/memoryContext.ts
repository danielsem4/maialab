import { createContext } from "react";
import type { Placements } from "@/common/utils/memoryUtils";

export interface IMemoryContext {
  /** Where the user hid each object in the first task — read by the recall tasks. */
  placements: Placements;
  setPlacements: (placements: Placements) => void;
}

export const MemoryContext = createContext<IMemoryContext | null>(null);

import { useState, type ReactNode } from "react";
import type { Placements } from "@/common/utils/memoryUtils";
import { MemoryContext } from "../memoryContext";

/** Holds the user's original object placements across the remounting demo tasks (in memory only). */
export function MemoryProvider({ children }: { children: ReactNode }) {
  const [placements, setPlacements] = useState<Placements>({});
  return <MemoryContext value={{ placements, setPlacements }}>{children}</MemoryContext>;
}

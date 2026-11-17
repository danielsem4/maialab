import { useContext } from "react";
import { MemoryContext } from "../memoryContext";

/** The placements shared between the memory demo's tasks. Must be used inside MemoryProvider. */
export function useMemoryPlacements() {
  const ctx = useContext(MemoryContext);
  if (!ctx) throw new Error("useMemoryPlacements must be used inside MemoryProvider");
  return ctx;
}

import { useEffect, useState } from "react";
import type { IRecipe } from "@/common/types/Supermarket";
import { buildBelt, isConveyorPassed } from "@/common/utils/supermarketUtils";
import { BELT_DISTRACTORS } from "../catalog";

const LOOP_MS = 16000;
/** With reduced motion the belt keeps moving (it is the task) but much slower. */
const REDUCED_LOOP_MS = 30000;
const LOOPS = 2;
const FINISH_DELAY_MS = 700;

function getLoopMs() {
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  return reduced ? REDUCED_LOOP_MS : LOOP_MS;
}

/** Conveyor task: tap the recipe's ingredients as they pass; ends when all are collected or after two loops. */
export function useConveyor(recipe: IRecipe, onComplete: (passed: boolean) => void) {
  const [loopMs] = useState(getLoopMs);
  const [collected, setCollected] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string[]>([]);
  const [timeUp, setTimeUp] = useState(false);
  const belt = buildBelt(recipe.ingredients, BELT_DISTRACTORS);
  const allCollected = recipe.ingredients.every((id) => collected.includes(id));
  const finished = timeUp || allCollected;

  useEffect(() => {
    const timer = setTimeout(() => setTimeUp(true), loopMs * LOOPS);
    return () => clearTimeout(timer);
  }, [loopMs]);

  useEffect(() => {
    if (!finished) return;
    const timer = setTimeout(() => onComplete(isConveyorPassed(collected, recipe.ingredients, wrong.length)), FINISH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [finished, collected, recipe.ingredients, wrong.length, onComplete]);

  function tap(id: string) {
    if (finished || collected.includes(id)) return;
    if (recipe.ingredients.includes(id)) setCollected((all) => [...all, id]);
    else setWrong((all) => [...all, id]);
  }

  return { belt, loopMs, collected, wrong, tap };
}

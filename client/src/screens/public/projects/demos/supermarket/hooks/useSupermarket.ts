import { createContext, useContext } from "react";
import type { IRecipe } from "@/common/types/Supermarket";
import { RECIPES } from "../catalog";

interface ISupermarketState {
  recipeId: string | null;
  setRecipeId: (id: string | null) => void;
}

/** State shared between the supermarket tasks (they remount one by one). */
export const SupermarketContext = createContext<ISupermarketState | null>(null);

export function useSupermarket(): ISupermarketState {
  const state = useContext(SupermarketContext);
  if (!state) throw new Error("useSupermarket must be used inside the supermarket demo");
  return state;
}

/** The recipe chosen in the first task — falls back to the first recipe if that task was skipped. */
export function useChosenRecipe(): IRecipe {
  const { recipeId } = useSupermarket();
  return RECIPES.find((recipe) => recipe.id === recipeId) ?? RECIPES[0];
}

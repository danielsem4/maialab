import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { IDemoTaskProps } from "@/common/types/Demo";
import { ChoiceButton } from "../../components/ChoiceButton";
import { TaskLayout } from "../../components/TaskLayout";
import { PRODUCTS_BY_ID, RECIPES } from "../catalog";
import { useSupermarket } from "../hooks/useSupermarket";

export function RecipeTask({ onComplete }: IDemoTaskProps) {
  const { t } = useTranslation();
  const { setRecipeId } = useSupermarket();

  // A new run starts here: forget the previous run's recipe.
  useEffect(() => {
    setRecipeId(null);
  }, [setRecipeId]);

  function handleSelect(id: string) {
    setRecipeId(id);
    onComplete(true);
  }

  return (
    <TaskLayout instruction={t("demos.supermarket.tasks.recipe.instruction")}>
      <div className="flex size-full items-center justify-center gap-8 px-8 pb-8">
        {RECIPES.map((recipe) => (
          <ChoiceButton
            key={recipe.id}
            value={recipe.id}
            onSelect={handleSelect}
            className="flex h-96 w-72 flex-col items-center gap-3 p-6 hover:border-primary"
          >
            <span className="text-7xl" aria-hidden>
              {recipe.emoji}
            </span>
            <span className="font-display text-2xl font-bold">{t(recipe.nameKey)}</span>
            <span className="text-base text-muted-foreground">{t("demos.supermarket.tasks.recipe.ingredients")}</span>
            <ul className="w-full space-y-1.5 text-start text-lg">
              {recipe.ingredients.map((id) => (
                <li key={id} className="flex items-center gap-3 rounded-lg bg-muted/60 px-3 py-1">
                  <span aria-hidden>{PRODUCTS_BY_ID[id].emoji}</span>
                  {t(PRODUCTS_BY_ID[id].nameKey)}
                </li>
              ))}
            </ul>
          </ChoiceButton>
        ))}
      </div>
    </TaskLayout>
  );
}

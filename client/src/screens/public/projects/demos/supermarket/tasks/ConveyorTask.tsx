import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import type { IDemoTaskProps } from "@/common/types/Demo";
import { cn } from "@/lib/utils";
import { TaskLayout } from "../../components/TaskLayout";
import { PRODUCTS_BY_ID } from "../catalog";
import { ConveyorBelt } from "../components/ConveyorBelt";
import { useChosenRecipe } from "../hooks/useSupermarket";
import { useConveyor } from "../hooks/useConveyor";

export function ConveyorTask({ onComplete }: IDemoTaskProps) {
  const { t } = useTranslation();
  const recipe = useChosenRecipe();
  const conveyor = useConveyor(recipe, onComplete);

  return (
    <TaskLayout instruction={t("demos.supermarket.tasks.conveyor.instruction", { recipe: t(recipe.nameKey) })}>
      <div className="flex size-full flex-col justify-center gap-12 pb-10">
        <ul className="flex justify-center gap-4 px-8" aria-label={t(recipe.nameKey)}>
          {recipe.ingredients.map((id) => {
            const done = conveyor.collected.includes(id);
            return (
              <li
                key={id}
                className={cn(
                  "flex items-center gap-3 rounded-xl border-2 bg-card px-5 py-3 text-xl transition-colors",
                  done && "border-primary bg-primary/10",
                )}
              >
                <span className="text-3xl" aria-hidden>
                  {PRODUCTS_BY_ID[id].emoji}
                </span>
                {t(PRODUCTS_BY_ID[id].nameKey)}
                {done && <Check className="size-6 text-primary" aria-label={t("demos.supermarket.tasks.conveyor.collected")} />}
              </li>
            );
          })}
        </ul>
        <ConveyorBelt
          belt={conveyor.belt}
          loopMs={conveyor.loopMs}
          collected={conveyor.collected}
          wrong={conveyor.wrong}
          onTap={conveyor.tap}
        />
      </div>
    </TaskLayout>
  );
}

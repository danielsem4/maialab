import { useState, type ReactNode } from "react";
import type { IDemoTask } from "@/common/types/Demo";
import { DemoRunner } from "../components/DemoRunner";
import { SupermarketContext } from "./hooks/useSupermarket";
import { ConveyorTask } from "./tasks/ConveyorTask";
import { RecipeTask } from "./tasks/RecipeTask";
import { ShopTask } from "./tasks/ShopTask";

const TASKS: IDemoTask[] = [
  { titleKey: "demos.supermarket.tasks.recipe.title", component: RecipeTask },
  { titleKey: "demos.supermarket.tasks.conveyor.title", component: ConveyorTask },
  { titleKey: "demos.supermarket.tasks.shop.title", component: ShopTask },
];

function SupermarketProvider({ children }: { children: ReactNode }) {
  const [recipeId, setRecipeId] = useState<string | null>(null);
  return <SupermarketContext value={{ recipeId, setRecipeId }}>{children}</SupermarketContext>;
}

export default function SupermarketDemo() {
  return (
    <SupermarketProvider>
      <DemoRunner i18nPrefix="demos.supermarket" tasks={TASKS} />
    </SupermarketProvider>
  );
}

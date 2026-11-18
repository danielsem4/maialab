import { lazy } from "react";
import type { IDemoDefinition } from "@/common/types/Demo";

/** Interactive demos by project slug. Each demo is code-split and only loaded on its demo page. */
const DEMOS: Record<string, IDemoDefinition> = {
  "clock-drawing-test": { device: "ipad", component: lazy(() => import("./clock/ClockDemo")) },
  "coffe-phone-test": { device: "ipad", component: lazy(() => import("./coffe/CoffeDemo")) },
  "hitber": { device: "ipad", component: lazy(() => import("./hitber/HitberDemo")) },
  "memory-test": { device: "ipad", component: lazy(() => import("./memory/MemoryDemo")) },
  "orientation-test": { device: "ipad", component: lazy(() => import("./orientation/OrientationDemo")) },
  "palpa-language-assessment": { device: "ipad", component: lazy(() => import("./palpa/PalpaDemo")) },
  "supermarket-test": { device: "ipad", component: lazy(() => import("./supermarket/SupermarketDemo")) },
};

export function getDemo(slug: string): IDemoDefinition | undefined {
  return DEMOS[slug];
}

import type { ComponentType, LazyExoticComponent } from "react";

export type DeviceType = "iphone" | "ipad";

/** Props every demo task receives: call onComplete once, with whether the task was passed. */
export interface IDemoTaskProps {
  onComplete: (passed: boolean) => void;
}

export interface IDemoTask {
  /** i18n key of the task's short title, listed on the result screen. */
  titleKey: string;
  component: ComponentType<IDemoTaskProps>;
}

export interface IDemoDefinition {
  device: DeviceType;
  /** Lazily loaded so each demo is its own chunk. */
  component: LazyExoticComponent<ComponentType>;
}

import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import type { IDeckElement, IDeckTheme } from "@/common/types/Deck";

export interface IElementRenderProps<P> {
  element: IDeckElement<P>;
  theme: IDeckTheme;
}

export interface IElementInspectorProps<P> {
  element: IDeckElement<P>;
  theme: IDeckTheme;
  onChange: (props: Partial<P>) => void;
}

/** Everything the editor needs to know about one element type. New types only add an entry to the registry. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- the registry holds definitions with different prop shapes
export interface IElementDefinition<P = any> {
  type: string;
  /** i18n key shown in the palette and the inspector. */
  labelKey: string;
  icon: LucideIcon;
  defaultSize: { w: number; h: number };
  createProps: () => P;
  Render: ComponentType<IElementRenderProps<P>>;
  Inspector: ComponentType<IElementInspectorProps<P>> | null;
  /** Resize keeps the aspect ratio. */
  keepRatio?: boolean;
}

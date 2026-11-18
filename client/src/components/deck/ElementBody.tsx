import type { IDeckElement, IDeckTheme } from "@/common/types/Deck";
import { getElementDefinition } from "./elements/registry";
import { UnknownElement } from "./elements/UnknownElement";

interface ElementBodyProps {
  element: IDeckElement;
  theme: IDeckTheme;
}

/** The inside of an element's box: its registered renderer, or a labelled placeholder for unknown types. */
export function ElementBody({ element, theme }: ElementBodyProps) {
  const definition = getElementDefinition(element.type);
  if (!definition) return <UnknownElement type={element.type} />;
  const Render = definition.Render;
  return <Render element={element} theme={theme} />;
}

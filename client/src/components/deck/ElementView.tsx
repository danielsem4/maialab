import type { IDeckElement, IDeckTheme } from "@/common/types/Deck";
import { elementBoxStyle } from "@/lib/deck/slideStyles";
import { UnknownElement } from "./elements/UnknownElement";

interface ElementViewProps {
  element: IDeckElement;
  theme: IDeckTheme;
}

/** Positions one element in slide space and renders its body. */
export function ElementView({ element }: ElementViewProps) {
  return (
    <div style={elementBoxStyle(element)}>
      <UnknownElement type={element.type} />
    </div>
  );
}

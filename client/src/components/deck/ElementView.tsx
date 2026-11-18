import type { IDeckElement, IDeckTheme } from "@/common/types/Deck";
import { elementBoxStyle } from "@/lib/deck/slideStyles";
import { ElementBody } from "./ElementBody";

interface ElementViewProps {
  element: IDeckElement;
  theme: IDeckTheme;
}

/** Positions one element in slide space and renders its body. */
export function ElementView({ element, theme }: ElementViewProps) {
  return (
    <div style={elementBoxStyle(element)}>
      <ElementBody element={element} theme={theme} />
    </div>
  );
}

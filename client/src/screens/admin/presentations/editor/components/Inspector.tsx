import { useTranslation } from "react-i18next";
import { updateElementProps } from "../editorCommands";
import { useSelectedElement } from "../hooks/useSelectedElement";
import { GeometryFields } from "./GeometryFields";
import { LayerButtons } from "./LayerButtons";
import { SelectionActions } from "./SelectionActions";
import { SlideSettings } from "./SlideSettings";

/** Properties of the selection; of the slide when nothing is selected. */
export function Inspector() {
  const { t } = useTranslation();
  const { slide, theme, selectedCount, element, definition } = useSelectedElement();
  const TypeInspector = definition?.Inspector ?? null;

  const handlePropsChange = (props: Record<string, unknown>) => {
    if (element) updateElementProps(element.id, props);
  };

  if (!slide || !theme) return null;

  return (
    <aside className="w-72 shrink-0 space-y-4 overflow-y-auto border-s p-3" aria-label={t("decks.inspector.title")}>
      <h2 className="text-sm font-semibold">
        {element && definition ? t(definition.labelKey) : t("decks.inspector.title")}
      </h2>
      {selectedCount === 0 && <SlideSettings slide={slide} theme={theme} />}
      {selectedCount > 1 && (
        <p className="text-sm text-muted-foreground">{t("decks.inspector.multiSelected", { count: selectedCount })}</p>
      )}
      {element && (
        <>
          <GeometryFields element={element} />
          <LayerButtons />
        </>
      )}
      {selectedCount > 0 && <SelectionActions />}
      {element && TypeInspector && <TypeInspector element={element} theme={theme} onChange={handlePropsChange} />}
    </aside>
  );
}

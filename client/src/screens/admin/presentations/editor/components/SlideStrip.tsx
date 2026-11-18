import { Copy, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ISlide } from "@/common/types/Deck";
import { SortableList } from "@/components/common/SortableList";
import { Button } from "@/components/ui/button";
import { useSlideStrip } from "../hooks/useSlideStrip";
import { SlideThumbnail } from "./SlideThumbnail";

const getSlideId = (slide: ISlide) => slide.id;

export function SlideStrip() {
  const { t } = useTranslation();
  const strip = useSlideStrip();
  const { theme } = strip;

  if (!theme) return null;

  const renderSlide = (slide: ISlide, index: number) => (
    <SlideThumbnail
      slide={slide}
      theme={theme}
      index={index}
      isCurrent={slide.id === strip.currentSlideId}
      onSelect={strip.handleSelect}
    />
  );

  return (
    <aside className="flex w-72 shrink-0 flex-col border-e" aria-label={t("decks.editor.slides")}>
      <div className="flex items-center gap-1 border-b p-2">
        <Button type="button" variant="outline" size="sm" onClick={strip.handleAdd} className="flex-1">
          <Plus className="size-4" />
          {t("decks.editor.addSlide")}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={strip.handleDuplicate}
          aria-label={t("decks.editor.duplicateSlide")}
          title={t("decks.editor.duplicateSlide")}
        >
          <Copy className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={strip.handleDelete}
          disabled={!strip.canDelete}
          aria-label={t("decks.editor.deleteSlide")}
          title={t("decks.editor.deleteSlide")}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        <SortableList
          items={strip.slides}
          getId={getSlideId}
          onReorder={strip.handleReorder}
          renderItem={renderSlide}
        />
      </div>
    </aside>
  );
}

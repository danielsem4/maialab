import { Copy, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { IDeckSummary } from "@/common/types/Deck";
import { formatRelativeTime } from "@/common/utils/relativeTime";
import { ConfirmDeleteButton } from "@/components/common/ConfirmDeleteButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DeckListRowProps {
  deck: IDeckSummary;
  onDuplicate: (id: number) => void;
  onDelete: (id: number) => void;
  disabled?: boolean;
}

export function DeckListRow({ deck, onDuplicate, onDelete, disabled }: DeckListRowProps) {
  const { t, i18n } = useTranslation();
  const editPath = `/admin/presentations/${deck.id}/edit`;

  const handleDuplicate = () => {
    onDuplicate(deck.id);
  };

  const handleDelete = () => {
    onDelete(deck.id);
  };

  return (
    <li className="flex items-center gap-3 rounded-lg glass p-3">
      <div className="min-w-0 flex-1">
        <Link to={editPath} dir="auto" className="block truncate font-medium hover:underline">
          {deck.title}
        </Link>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          {deck.isTemplate && <Badge variant="secondary">{t("decks.template")}</Badge>}
          <span>{t("decks.slideCount", { count: deck.slideCount })}</span>
          <span aria-hidden="true">·</span>
          <span>{formatRelativeTime(deck.updatedAt, i18n.language)}</span>
        </div>
      </div>
      <Button variant="ghost" size="icon" asChild>
        <Link to={editPath} aria-label={t("decks.edit")}>
          <Pencil className="size-4" />
        </Link>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleDuplicate}
        disabled={disabled}
        aria-label={t("decks.duplicate")}
      >
        <Copy className="size-4" />
      </Button>
      <ConfirmDeleteButton name={deck.title} onConfirm={handleDelete} />
    </li>
  );
}

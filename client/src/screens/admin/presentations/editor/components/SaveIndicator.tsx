import { AlertTriangle, Check, CircleDashed, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/ui/spinner";
import type { SaveState } from "@/lib/deck/saveQueue";
import { cn } from "@/lib/utils";

interface SaveIndicatorProps {
  state: SaveState;
}

const LABEL_KEYS: Record<SaveState, string> = {
  saved: "decks.editor.saved",
  saving: "decks.editor.saving",
  dirty: "decks.editor.unsaved",
  error: "decks.editor.saveError",
  conflict: "decks.editor.conflictTitle",
};

const ICONS: Record<SaveState, LucideIcon | null> = {
  saved: Check,
  saving: null,
  dirty: CircleDashed,
  error: AlertTriangle,
  conflict: AlertTriangle,
};

export function SaveIndicator({ state }: SaveIndicatorProps) {
  const { t } = useTranslation();
  const Icon = ICONS[state];
  const isProblem = state === "error" || state === "conflict";

  return (
    <span
      role="status"
      className={cn(
        "flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground",
        isProblem && "text-destructive",
      )}
    >
      {Icon ? <Icon className="size-4" aria-hidden="true" /> : <Spinner />}
      <span className="max-sm:sr-only">{t(LABEL_KEYS[state])}</span>
    </span>
  );
}

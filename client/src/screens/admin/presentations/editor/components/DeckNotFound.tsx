import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface DeckNotFoundProps {
  /** i18n key explaining why the deck cannot be shown. */
  messageKey: string;
}

export function DeckNotFound({ messageKey }: DeckNotFoundProps) {
  const { t } = useTranslation();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="max-w-md text-muted-foreground">{t(messageKey)}</p>
      <Button asChild variant="outline">
        <Link to="/admin/presentations">{t("decks.backToList")}</Link>
      </Button>
    </div>
  );
}

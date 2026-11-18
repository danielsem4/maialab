import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { DeckNotFound } from "./components/DeckNotFound";
import { useDeckLoader, type DeckLoadStatus } from "./hooks/useDeckLoader";

const FAILURE_KEYS: Partial<Record<DeckLoadStatus, string>> = {
  notFound: "decks.notFound",
  invalid: "decks.invalidDoc",
  error: "common.loadFailed",
};

export default function DeckEditor() {
  const { t } = useTranslation();
  const { status, deck } = useDeckLoader();
  const failureKey = FAILURE_KEYS[status];

  if (failureKey) return <DeckNotFound messageKey={failureKey} />;

  if (!deck) {
    return (
      <div className="flex h-full items-center justify-center" aria-busy="true" aria-label={t("common.loading.title")}>
        <Spinner className="size-6" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 border-b p-3">
        <Button asChild variant="ghost" size="icon">
          <Link to="/admin/presentations" aria-label={t("decks.editor.back")}>
            <ArrowLeft className="size-4 rtl:rotate-180" />
          </Link>
        </Button>
        <h1 dir="auto" className="truncate text-base font-semibold">
          {deck.title}
        </h1>
      </header>
    </div>
  );
}

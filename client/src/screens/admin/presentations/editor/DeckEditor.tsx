import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/ui/spinner";
import { DeckNotFound } from "./components/DeckNotFound";
import { DeckWorkspace } from "./components/DeckWorkspace";
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

  return <DeckWorkspace key={deck.id} deck={deck} />;
}

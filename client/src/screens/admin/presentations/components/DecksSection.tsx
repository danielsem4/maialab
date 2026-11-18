import { useTranslation } from "react-i18next";
import { FormSection } from "@/components/common/FormSection";
import { QueryState } from "@/components/common/QueryState";
import type { useDecksList } from "../hooks/useDecksList";
import { DeckListRow } from "./DeckListRow";
import { NewDeckDialog } from "./NewDeckDialog";

interface DecksSectionProps {
  list: ReturnType<typeof useDecksList>;
}

export function DecksSection({ list }: DecksSectionProps) {
  const { t } = useTranslation();

  return (
    <FormSection
      title={t("decks.sectionTitle")}
      description={t("decks.sectionDesc")}
      actions={<NewDeckDialog templates={list.templates} />}
    >
      <QueryState
        isLoading={list.isLoading}
        isError={list.isError}
        onRetry={list.handleRetry}
        isEmpty={list.decks.length === 0}
        empty={t("decks.empty")}
      >
        <ul className="space-y-2">
          {list.decks.map((deck) => (
            <DeckListRow
              key={deck.id}
              deck={deck}
              onDuplicate={list.handleDuplicate}
              onDelete={list.handleDelete}
              disabled={list.isDuplicating}
            />
          ))}
        </ul>
      </QueryState>
    </FormSection>
  );
}

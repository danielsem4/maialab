import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "@/components/common/AdminPageHeader";
import { DecksSection } from "./components/DecksSection";
import { LabDeckSection } from "./components/LabDeckSection";
import { useDecksList } from "./hooks/useDecksList";
import { useLabDeckBuilder } from "./hooks/useLabDeckBuilder";

export default function PresentationsBuilder() {
  const { t } = useTranslation();
  const builder = useLabDeckBuilder();
  const decks = useDecksList();

  return (
    <div className="max-w-4xl space-y-6">
      <AdminPageHeader title={t("presentations.title")} description={t("presentations.description")} />
      <DecksSection list={decks} />
      <LabDeckSection builder={builder} />
      <p className="flex items-start gap-2 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <span>{t("presentations.projectDeckHint")}</span>
      </p>
    </div>
  );
}

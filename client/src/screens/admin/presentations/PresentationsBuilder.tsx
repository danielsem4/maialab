import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AdminPageHeader } from "@/components/common/AdminPageHeader";
import { LabDeckSection } from "./components/LabDeckSection";
import { useLabDeckBuilder } from "./hooks/useLabDeckBuilder";

export default function PresentationsBuilder() {
  const { t } = useTranslation();
  const builder = useLabDeckBuilder();

  return (
    <div className="max-w-4xl space-y-6">
      <AdminPageHeader title={t("presentations.title")} description={t("presentations.description")} />
      <LabDeckSection builder={builder} />
      <p className="flex items-start gap-2 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <span>{t("presentations.projectDeckHint")}</span>
      </p>
    </div>
  );
}

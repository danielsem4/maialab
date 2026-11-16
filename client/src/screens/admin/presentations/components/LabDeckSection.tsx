import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FormSection } from "@/components/common/FormSection";
import { QueryState } from "@/components/common/QueryState";
import { SwitchField } from "@/components/common/SwitchField";
import { LoadingButton } from "@/components/ui/LoadingButton";
import type { useLabDeckBuilder } from "../hooks/useLabDeckBuilder";
import { ProjectChecklist } from "./ProjectChecklist";

interface LabDeckSectionProps {
  builder: ReturnType<typeof useLabDeckBuilder>;
}

export function LabDeckSection({ builder }: LabDeckSectionProps) {
  const { t } = useTranslation();

  return (
    <FormSection title={t("presentations.labDeck")} description={t("presentations.labDeckDesc")}>
      <QueryState
        isLoading={builder.isLoading}
        isError={builder.isError}
        onRetry={builder.handleRetry}
        isEmpty={builder.projects.length === 0}
        empty={t("presentations.noProjects")}
      >
        <ProjectChecklist
          projects={builder.projects}
          selectedIds={builder.selectedIds}
          showError={builder.showSelectionError}
          onToggle={builder.handleToggleProject}
          onSelectAll={builder.handleSelectAll}
          onClear={builder.handleClear}
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-8">
          <SwitchField
            id="deck-include-team"
            label={t("presentations.includeTeam")}
            checked={builder.includeTeam}
            onCheckedChange={builder.setIncludeTeam}
          />
          <SwitchField
            id="deck-include-publications"
            label={t("presentations.includePublications")}
            checked={builder.includePublications}
            onCheckedChange={builder.setIncludePublications}
          />
        </div>
        <LoadingButton
          type="button"
          onClick={builder.handleDownload}
          loading={builder.isGenerating}
          loadingText={t("presentations.generating")}
        >
          <Download className="size-4" />
          {t("presentations.generate")}
        </LoadingButton>
      </QueryState>
    </FormSection>
  );
}

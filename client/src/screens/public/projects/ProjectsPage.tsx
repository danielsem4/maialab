import { useTranslation } from "react-i18next";
import { ProjectIndex } from "@/components/common/ProjectIndex";
import { PublicPageHeader } from "@/components/common/PublicPageHeader";
import { QueryState } from "@/components/common/QueryState";
import { StatusFilter } from "./components/StatusFilter";
import { useProjectFilter } from "./hooks/useProjectFilter";

export default function ProjectsPage() {
  const { t } = useTranslation();
  const filter = useProjectFilter();

  return (
    <>
      <PublicPageHeader title={t("projects.publicTitle")} intro={t("projects.publicIntro")}>
        <StatusFilter value={filter.status} options={filter.availableStatuses} onChange={filter.handleStatusChange} />
      </PublicPageHeader>
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <QueryState
          isLoading={filter.isLoading}
          isError={filter.isError}
          onRetry={filter.handleRetry}
          isEmpty={filter.isEmpty}
          empty={t("projects.publicEmpty")}
        >
          <ProjectIndex projects={filter.projects} />
        </QueryState>
      </section>
    </>
  );
}

import { useTranslation } from "react-i18next";
import { PublicPageHeader } from "@/components/common/PublicPageHeader";
import { QueryState } from "@/components/common/QueryState";
import { YearFilter } from "./components/YearFilter";
import { YearGroup } from "./components/YearGroup";
import { usePublicationsPage } from "./hooks/usePublicationsPage";

export default function PublicationsPage() {
  const { t } = useTranslation();
  const page = usePublicationsPage();

  return (
    <>
      <PublicPageHeader title={t("publications.publicTitle")} intro={t("publications.publicIntro")}>
        <YearFilter value={page.year} options={page.years} onChange={page.handleYearChange} />
      </PublicPageHeader>
      <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <QueryState
          isLoading={page.isLoading}
          isError={page.isError}
          onRetry={page.handleRetry}
          isEmpty={page.isEmpty}
          empty={t("publications.publicEmpty")}
        >
          <div className="space-y-14">
            {page.groups.map((group) => (
              <YearGroup key={group.year} group={group} />
            ))}
          </div>
        </QueryState>
      </div>
    </>
  );
}

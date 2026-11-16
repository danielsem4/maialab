import { useTranslation } from "react-i18next";
import { PublicPageHeader } from "@/components/common/PublicPageHeader";
import { QueryState } from "@/components/common/QueryState";
import { TeamSection } from "./components/TeamSection";
import { useTeamPage } from "./hooks/useTeamPage";

export default function TeamPage() {
  const { t } = useTranslation();
  const team = useTeamPage();

  return (
    <>
      <PublicPageHeader title={t("members.publicTitle")} intro={t("members.publicIntro")} />
      <div className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <QueryState
          isLoading={team.isLoading}
          isError={team.isError}
          onRetry={team.handleRetry}
          isEmpty={team.isEmpty}
          empty={t("members.publicEmpty")}
        >
          <div className="space-y-20">
            {team.groups.map((group) => (
              <TeamSection key={group.category} group={group} />
            ))}
          </div>
        </QueryState>
      </div>
    </>
  );
}

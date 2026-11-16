import { useLabInfo } from "@/hooks/queries/useLabInfoQueries";
import { useLatestNews } from "@/hooks/queries/useNewsQueries";
import { usePublishedProjects } from "@/hooks/queries/useProjectQueries";

const FALLBACK_PROJECT_COUNT = 4;

export function useHomePage() {
  const labInfoQuery = useLabInfo();
  const projectsQuery = usePublishedProjects();
  const newsQuery = useLatestNews(3);

  const labInfo = labInfoQuery.data ?? null;
  const projects = projectsQuery.data ?? [];
  const featured = projects.filter((project) => project.featured);
  const selectedProjects = featured.length > 0 ? featured : projects.slice(0, FALLBACK_PROJECT_COUNT);

  return {
    labInfo,
    isLabInfoLoading: labInfoQuery.isLoading,
    needsSetup: !labInfoQuery.isLoading && (!labInfo || (!labInfo.tagline && !labInfo.about)),
    selectedProjects,
    latestNews: newsQuery.data ?? [],
  };
}

import { useState } from "react";
import { useAdminProjects } from "@/hooks/queries/useProjectQueries";
import { useDownloadLabDeck } from "@/hooks/queries/usePresentationQueries";

export function useLabDeckBuilder() {
  const query = useAdminProjects();
  const download = useDownloadLabDeck();
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set());
  const [includeTeam, setIncludeTeam] = useState(true);
  const [includePublications, setIncludePublications] = useState(true);
  const [attempted, setAttempted] = useState(false);

  const projects = query.data ?? [];

  const handleToggleProject = (id: number, checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedIds(new Set(projects.map((project) => project.id)));
  };

  const handleClear = () => {
    setSelectedIds(new Set());
  };

  const handleRetry = () => {
    void query.refetch();
  };

  const handleDownload = () => {
    setAttempted(true);
    // Keep the admin list order so the deck follows the site's project order.
    const projectIds = projects.filter((project) => selectedIds.has(project.id)).map((project) => project.id);
    if (projectIds.length === 0) return;
    download.mutate({ projectIds, includeTeam, includePublications });
  };

  return {
    projects,
    isLoading: query.isLoading,
    isError: query.isError,
    selectedIds,
    includeTeam,
    includePublications,
    showSelectionError: attempted && selectedIds.size === 0,
    isGenerating: download.isPending,
    setIncludeTeam,
    setIncludePublications,
    handleToggleProject,
    handleSelectAll,
    handleClear,
    handleRetry,
    handleDownload,
  };
}

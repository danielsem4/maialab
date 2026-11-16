import { useTranslation } from "react-i18next";
import { useDashboard } from "@/hooks/queries/useDashboardQueries";
import { useAuthStore } from "@/store/useAuthStore";

export function useDashboardScreen() {
  const { t } = useTranslation();
  const name = useAuthStore((s) => s.name);
  const query = useDashboard();

  const handleRetry = () => {
    void query.refetch();
  };

  return {
    heading: name ? t("dashboard.welcome", { name }) : t("dashboard.title"),
    counts: query.data?.counts,
    activity: query.data?.recentActivity ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    handleRetry,
  };
}

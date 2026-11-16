import { AdminPageHeader } from "@/components/common/AdminPageHeader";
import { QueryState } from "@/components/common/QueryState";
import { ActivityList } from "./components/ActivityList";
import { CountTiles } from "./components/CountTiles";
import { QuickActions } from "./components/QuickActions";
import { useDashboardScreen } from "./hooks/useDashboardScreen";

export default function Dashboard() {
  const dashboard = useDashboardScreen();

  return (
    <div>
      <AdminPageHeader title={dashboard.heading} />
      <QueryState isLoading={dashboard.isLoading} isError={dashboard.isError} onRetry={dashboard.handleRetry}>
        <div className="space-y-8">
          {dashboard.counts && <CountTiles counts={dashboard.counts} />}
          <QuickActions />
          <ActivityList entries={dashboard.activity} />
        </div>
      </QueryState>
    </div>
  );
}

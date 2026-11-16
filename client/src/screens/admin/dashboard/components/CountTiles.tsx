import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { IDashboardCounts } from "@/common/types/Dashboard";

interface CountTilesProps {
  counts: IDashboardCounts;
}

interface TileProps {
  to: string;
  label: string;
  value: number;
  note?: string;
}

function CountTile({ to, label, value, note }: TileProps) {
  return (
    <Link
      to={to}
      className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
      {note && <p className="mt-0.5 text-xs text-muted-foreground">{note}</p>}
    </Link>
  );
}

export function CountTiles({ counts }: CountTilesProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <CountTile
        to="/admin/projects"
        label={t("dashboard.counts.projects")}
        value={counts.projects}
        note={t("dashboard.counts.publishedProjects", { count: counts.publishedProjects })}
      />
      <CountTile to="/admin/members" label={t("dashboard.counts.members")} value={counts.members} />
      <CountTile to="/admin/publications" label={t("dashboard.counts.publications")} value={counts.publications} />
      <CountTile to="/admin/news" label={t("dashboard.counts.news")} value={counts.news} />
      <CountTile to="/admin/media" label={t("dashboard.counts.media")} value={counts.media} />
    </div>
  );
}

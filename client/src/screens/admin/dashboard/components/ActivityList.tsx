import { useTranslation } from "react-i18next";
import type { IAuditEntry } from "@/common/types/Dashboard";
import { formatRelativeTime } from "@/common/utils/relativeTime";

interface ActivityListProps {
  entries: IAuditEntry[];
}

function detailsTitle(entry: IAuditEntry): string | null {
  const title = entry.details?.["title"];
  return typeof title === "string" && title ? title : null;
}

function ActivityItem({ entry }: { entry: IAuditEntry }) {
  const { t, i18n } = useTranslation();
  const title = detailsTitle(entry);
  const sentence = t("dashboard.activity", {
    user: entry.user.name || entry.user.email,
    action: t(`dashboard.actions.${entry.action}`),
    entity: t(`dashboard.entities.${entry.entityType}`),
  });

  return (
    <li className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3">
      <div className="min-w-0">
        <p className="text-sm">{sentence}</p>
        {title && (
          <p className="truncate text-sm text-muted-foreground" dir="auto">
            {title}
          </p>
        )}
      </div>
      <time dateTime={entry.createdAt} className="shrink-0 text-xs text-muted-foreground">
        {formatRelativeTime(entry.createdAt, i18n.language)}
      </time>
    </li>
  );
}

export function ActivityList({ entries }: ActivityListProps) {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="recent-activity-heading">
      <h3 id="recent-activity-heading" className="mb-1 text-sm font-medium text-muted-foreground">
        {t("dashboard.recentActivity")}
      </h3>
      {entries.length === 0 ? (
        <p className="py-6 text-sm text-muted-foreground">{t("dashboard.noActivity")}</p>
      ) : (
        <ul className="divide-y rounded-lg border px-4">
          {entries.map((entry) => (
            <ActivityItem key={entry.id} entry={entry} />
          ))}
        </ul>
      )}
    </section>
  );
}

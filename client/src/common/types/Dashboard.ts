export interface IDashboardCounts {
  projects: number;
  publishedProjects: number;
  members: number;
  publications: number;
  news: number;
  media: number;
}

export interface IAuditEntry {
  id: number;
  action: "CREATE" | "UPDATE" | "DELETE" | "REORDER" | "EXPORT";
  entityType: string;
  entityId: number;
  details: Record<string, unknown> | null;
  createdAt: string;
  user: { name: string; email: string };
}

export interface IDashboard {
  counts: IDashboardCounts;
  recentActivity: IAuditEntry[];
}

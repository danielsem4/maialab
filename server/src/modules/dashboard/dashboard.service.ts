import type { AuditRecord, DashboardCounts, IDashboardRepository } from './dashboard.repository';

const RECENT_ACTIVITY_LIMIT = 15;

export interface AuditEntryDto {
  id: number;
  action: string;
  entityType: string;
  entityId: number;
  details: Record<string, unknown> | null;
  createdAt: Date;
  user: { name: string; email: string };
}

export interface DashboardDto {
  counts: DashboardCounts;
  recentActivity: AuditEntryDto[];
}

function toDetails(value: AuditRecord['details']): Record<string, unknown> | null {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value as Record<string, unknown>;
  return null;
}

function toAuditEntryDto(entry: AuditRecord): AuditEntryDto {
  return {
    id: entry.id,
    action: entry.action,
    entityType: entry.entityType,
    entityId: entry.entityId,
    details: toDetails(entry.details),
    createdAt: entry.createdAt,
    user: { name: entry.user.name ?? '', email: entry.user.email },
  };
}

export class DashboardService {
  constructor(private readonly repository: IDashboardRepository) {}

  async get(): Promise<DashboardDto> {
    const [counts, activity] = await Promise.all([
      this.repository.getCounts(),
      this.repository.findRecentActivity(RECENT_ACTIVITY_LIMIT),
    ]);
    return { counts, recentActivity: activity.map(toAuditEntryDto) };
  }
}

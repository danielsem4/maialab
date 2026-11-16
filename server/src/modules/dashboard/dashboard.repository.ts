import type { Prisma } from '@prisma/client';
import prisma from '../../lib/prisma';

export interface DashboardCounts {
  projects: number;
  publishedProjects: number;
  members: number;
  publications: number;
  news: number;
  media: number;
}

export const auditInclude = {
  user: { select: { name: true, email: true } },
} satisfies Prisma.AuditLogInclude;

export type AuditRecord = Prisma.AuditLogGetPayload<{ include: typeof auditInclude }>;

export interface IDashboardRepository {
  getCounts(): Promise<DashboardCounts>;
  findRecentActivity(limit: number): Promise<AuditRecord[]>;
}

export class DashboardRepository implements IDashboardRepository {
  async getCounts(): Promise<DashboardCounts> {
    const [projects, publishedProjects, members, publications, news, media] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { published: true } }),
      prisma.member.count(),
      prisma.publication.count(),
      prisma.newsPost.count(),
      prisma.media.count(),
    ]);
    return { projects, publishedProjects, members, publications, news, media };
  }

  async findRecentActivity(limit: number): Promise<AuditRecord[]> {
    return prisma.auditLog.findMany({
      include: auditInclude,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit,
    });
  }
}

import type { Prisma } from '@prisma/client';
import prisma from '../../lib/prisma';
import type { ProjectInputDto } from './projects.schema';

export const projectInclude = {
  cover: true,
  images: { include: { media: true }, orderBy: { sortOrder: 'asc' } },
  members: { include: { member: { include: { photo: true } } } },
  publications: { orderBy: { year: 'desc' } },
} satisfies Prisma.ProjectInclude;

export type ProjectRecord = Prisma.ProjectGetPayload<{ include: typeof projectInclude }>;

type ProjectData = Omit<ProjectInputDto, 'images' | 'members'> & { slug: string };

export interface IProjectRepository {
  findAll(publishedOnly: boolean): Promise<ProjectRecord[]>;
  findById(id: number): Promise<ProjectRecord | null>;
  findBySlug(slug: string, publishedOnly: boolean): Promise<ProjectRecord | null>;
  slugExists(slug: string, excludeId?: number): Promise<boolean>;
  create(data: ProjectData, dto: ProjectInputDto): Promise<ProjectRecord>;
  update(id: number, data: ProjectData, dto: ProjectInputDto): Promise<ProjectRecord>;
  delete(id: number): Promise<void>;
  reorder(ids: number[]): Promise<void>;
}

function relations(dto: ProjectInputDto) {
  return {
    images: {
      create: dto.images.map((img, index) => ({ mediaId: img.mediaId, caption: img.caption, sortOrder: index })),
    },
    members: {
      create: dto.members.map((m) => ({ memberId: m.memberId, role: m.role })),
    },
  };
}

export class ProjectRepository implements IProjectRepository {
  async findAll(publishedOnly: boolean): Promise<ProjectRecord[]> {
    return prisma.project.findMany({
      where: publishedOnly ? { published: true } : undefined,
      include: projectInclude,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findById(id: number): Promise<ProjectRecord | null> {
    return prisma.project.findUnique({ where: { id }, include: projectInclude });
  }

  async findBySlug(slug: string, publishedOnly: boolean): Promise<ProjectRecord | null> {
    return prisma.project.findFirst({
      where: { slug, ...(publishedOnly ? { published: true } : {}) },
      include: projectInclude,
    });
  }

  async slugExists(slug: string, excludeId?: number): Promise<boolean> {
    const count = await prisma.project.count({ where: { slug, NOT: excludeId ? { id: excludeId } : undefined } });
    return count > 0;
  }

  async create(data: ProjectData, dto: ProjectInputDto): Promise<ProjectRecord> {
    const last = await prisma.project.aggregate({ _max: { sortOrder: true } });
    return prisma.project.create({
      data: { ...data, sortOrder: (last._max.sortOrder ?? -1) + 1, ...relations(dto) },
      include: projectInclude,
    });
  }

  async update(id: number, data: ProjectData, dto: ProjectInputDto): Promise<ProjectRecord> {
    return prisma.$transaction(async (tx) => {
      await tx.projectImage.deleteMany({ where: { projectId: id } });
      await tx.projectMember.deleteMany({ where: { projectId: id } });
      return tx.project.update({ where: { id }, data: { ...data, ...relations(dto) }, include: projectInclude });
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.project.delete({ where: { id } });
  }

  async reorder(ids: number[]): Promise<void> {
    await prisma.$transaction(
      ids.map((id, index) => prisma.project.update({ where: { id }, data: { sortOrder: index } })),
    );
  }
}

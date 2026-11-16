import prisma from '../../lib/prisma';
import type { MediaRecord } from '../../shared/utils/media';

export interface CreateMediaData {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  uploadedById: number;
}

export interface IMediaRepository {
  create(data: CreateMediaData): Promise<MediaRecord>;
  findAll(): Promise<MediaRecord[]>;
  findById(id: number): Promise<MediaRecord | null>;
  updateAlt(id: number, alt: string): Promise<MediaRecord>;
  countReferences(id: number): Promise<number>;
  delete(id: number): Promise<void>;
}

export class MediaRepository implements IMediaRepository {
  async create(data: CreateMediaData): Promise<MediaRecord> {
    return prisma.media.create({ data });
  }

  async findAll(): Promise<MediaRecord[]> {
    return prisma.media.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findById(id: number): Promise<MediaRecord | null> {
    return prisma.media.findUnique({ where: { id } });
  }

  async updateAlt(id: number, alt: string): Promise<MediaRecord> {
    return prisma.media.update({ where: { id }, data: { alt } });
  }

  async countReferences(id: number): Promise<number> {
    const counts = await Promise.all([
      prisma.labInfo.count({ where: { OR: [{ logoMediaId: id }, { heroMediaId: id }] } }),
      prisma.project.count({ where: { coverMediaId: id } }),
      prisma.projectImage.count({ where: { mediaId: id } }),
      prisma.member.count({ where: { photoMediaId: id } }),
      prisma.publication.count({ where: { pdfMediaId: id } }),
      prisma.newsPost.count({ where: { coverMediaId: id } }),
    ]);
    return counts.reduce((sum, n) => sum + n, 0);
  }

  async delete(id: number): Promise<void> {
    await prisma.media.delete({ where: { id } });
  }
}

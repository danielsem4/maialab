import type { Prisma } from '@prisma/client';
import prisma from '../../lib/prisma';
import type { PublicationInputDto } from './publications.schema';

export const publicationInclude = {
  pdf: true,
  project: { select: { id: true, slug: true, title: true, published: true } },
} satisfies Prisma.PublicationInclude;

export type PublicationRecord = Prisma.PublicationGetPayload<{ include: typeof publicationInclude }>;

export interface IPublicationRepository {
  findAll(publishedOnly: boolean): Promise<PublicationRecord[]>;
  findById(id: number): Promise<PublicationRecord | null>;
  create(dto: PublicationInputDto): Promise<PublicationRecord>;
  update(id: number, dto: PublicationInputDto): Promise<PublicationRecord>;
  delete(id: number): Promise<void>;
}

export class PublicationRepository implements IPublicationRepository {
  async findAll(publishedOnly: boolean): Promise<PublicationRecord[]> {
    return prisma.publication.findMany({
      where: publishedOnly ? { published: true } : undefined,
      include: publicationInclude,
      orderBy: [{ year: 'desc' }, { title: 'asc' }],
    });
  }

  async findById(id: number): Promise<PublicationRecord | null> {
    return prisma.publication.findUnique({ where: { id }, include: publicationInclude });
  }

  async create(dto: PublicationInputDto): Promise<PublicationRecord> {
    return prisma.publication.create({ data: dto, include: publicationInclude });
  }

  async update(id: number, dto: PublicationInputDto): Promise<PublicationRecord> {
    return prisma.publication.update({ where: { id }, data: dto, include: publicationInclude });
  }

  async delete(id: number): Promise<void> {
    await prisma.publication.delete({ where: { id } });
  }
}

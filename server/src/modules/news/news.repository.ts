import type { Prisma } from '@prisma/client';
import prisma from '../../lib/prisma';
import type { NewsInputDto } from './news.schema';

export const newsInclude = { cover: true } satisfies Prisma.NewsPostInclude;

export type NewsRecord = Prisma.NewsPostGetPayload<{ include: typeof newsInclude }>;

type NewsData = Omit<NewsInputDto, 'slug'> & { slug: string };

export interface INewsRepository {
  findAll(publishedOnly: boolean, limit?: number): Promise<NewsRecord[]>;
  findById(id: number): Promise<NewsRecord | null>;
  findBySlug(slug: string, publishedOnly: boolean): Promise<NewsRecord | null>;
  slugExists(slug: string, excludeId?: number): Promise<boolean>;
  create(data: NewsData): Promise<NewsRecord>;
  update(id: number, data: NewsData): Promise<NewsRecord>;
  delete(id: number): Promise<void>;
}

export class NewsRepository implements INewsRepository {
  async findAll(publishedOnly: boolean, limit?: number): Promise<NewsRecord[]> {
    return prisma.newsPost.findMany({
      where: publishedOnly ? { published: true } : undefined,
      include: newsInclude,
      orderBy: [{ date: 'desc' }, { id: 'desc' }],
      take: limit,
    });
  }

  async findById(id: number): Promise<NewsRecord | null> {
    return prisma.newsPost.findUnique({ where: { id }, include: newsInclude });
  }

  async findBySlug(slug: string, publishedOnly: boolean): Promise<NewsRecord | null> {
    return prisma.newsPost.findFirst({
      where: { slug, ...(publishedOnly ? { published: true } : {}) },
      include: newsInclude,
    });
  }

  async slugExists(slug: string, excludeId?: number): Promise<boolean> {
    const count = await prisma.newsPost.count({ where: { slug, NOT: excludeId ? { id: excludeId } : undefined } });
    return count > 0;
  }

  async create(data: NewsData): Promise<NewsRecord> {
    return prisma.newsPost.create({ data, include: newsInclude });
  }

  async update(id: number, data: NewsData): Promise<NewsRecord> {
    return prisma.newsPost.update({ where: { id }, data, include: newsInclude });
  }

  async delete(id: number): Promise<void> {
    await prisma.newsPost.delete({ where: { id } });
  }
}

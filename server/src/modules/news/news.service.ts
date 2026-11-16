import { AppError } from '../../shared/errors/AppError';
import { recordAudit } from '../../shared/utils/audit';
import { slugify } from '../../shared/utils/slug';
import type { INewsRepository } from './news.repository';
import { toNewsDto, type NewsDto } from './news.mapper';
import type { NewsInputDto } from './news.schema';

export class NewsService {
  constructor(private readonly repository: INewsRepository) {}

  async listPublished(limit?: number): Promise<NewsDto[]> {
    const posts = await this.repository.findAll(true, limit);
    return posts.map(toNewsDto);
  }

  async getPublishedBySlug(slug: string): Promise<NewsDto> {
    const post = await this.repository.findBySlug(slug, true);
    if (!post) throw new AppError('News post not found', 404);
    return toNewsDto(post);
  }

  async listAll(): Promise<NewsDto[]> {
    const posts = await this.repository.findAll(false);
    return posts.map(toNewsDto);
  }

  async getById(id: number): Promise<NewsDto> {
    const post = await this.repository.findById(id);
    if (!post) throw new AppError('News post not found', 404);
    return toNewsDto(post);
  }

  async create(userId: number, dto: NewsInputDto): Promise<NewsDto> {
    const slug = await this.resolveSlug(dto);
    const post = await this.repository.create({ ...dto, slug });
    await recordAudit(userId, 'CREATE', 'NewsPost', post.id, { title: post.title });
    return toNewsDto(post);
  }

  async update(userId: number, id: number, dto: NewsInputDto): Promise<NewsDto> {
    await this.getById(id);
    const slug = await this.resolveSlug(dto, id);
    const post = await this.repository.update(id, { ...dto, slug });
    await recordAudit(userId, 'UPDATE', 'NewsPost', id, { title: post.title });
    return toNewsDto(post);
  }

  async remove(userId: number, id: number): Promise<void> {
    const post = await this.getById(id);
    await this.repository.delete(id);
    await recordAudit(userId, 'DELETE', 'NewsPost', id, { title: post.title });
  }

  private async resolveSlug(dto: NewsInputDto, excludeId?: number): Promise<string> {
    const slug = dto.slug || slugify(dto.title);
    if (!slug) throw new AppError('A URL slug could not be generated from the title', 400);
    if (await this.repository.slugExists(slug, excludeId)) {
      throw new AppError('Another news post already uses this URL slug', 409);
    }
    return slug;
  }
}

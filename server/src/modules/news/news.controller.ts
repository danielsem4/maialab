import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/errors/AppError';
import { parseId } from '../../shared/utils/params';
import type { NewsService } from './news.service';
import { newsListQuerySchema, type NewsInputDto } from './news.schema';

function parseLimit(query: unknown): number | undefined {
  const result = newsListQuerySchema.safeParse(query);
  if (!result.success) throw new AppError('limit must be an integer between 1 and 50', 400);
  return result.data.limit;
}

export function createNewsController(service: NewsService) {
  return {
    async listPublished(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        res.json({ posts: await service.listPublished(parseLimit(req.query)) });
      } catch (err) {
        next(err);
      }
    },

    async getPublished(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        res.json({ post: await service.getPublishedBySlug(String(req.params['slug'])) });
      } catch (err) {
        next(err);
      }
    },

    async listAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        res.json({ posts: await service.listAll() });
      } catch (err) {
        next(err);
      }
    },

    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        res.json({ post: await service.getById(parseId(req.params['id'])) });
      } catch (err) {
        next(err);
      }
    },

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const post = await service.create(req.currentUser!.userId, req.body as NewsInputDto);
        res.status(201).json({ post });
      } catch (err) {
        next(err);
      }
    },

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const id = parseId(req.params['id']);
        const post = await service.update(req.currentUser!.userId, id, req.body as NewsInputDto);
        res.json({ post });
      } catch (err) {
        next(err);
      }
    },

    async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        await service.remove(req.currentUser!.userId, parseId(req.params['id']));
        res.status(204).end();
      } catch (err) {
        next(err);
      }
    },
  };
}

import type { Request, Response, NextFunction } from 'express';
import { parseId } from '../../shared/utils/params';
import type { ProjectService } from './projects.service';
import type { ProjectInputDto, ReorderDto } from './projects.schema';

export function createProjectController(service: ProjectService) {
  return {
    async listPublished(_req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        res.json({ projects: await service.listPublished() });
      } catch (err) {
        next(err);
      }
    },

    async getPublished(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        res.json({ project: await service.getPublishedBySlug(String(req.params['slug'])) });
      } catch (err) {
        next(err);
      }
    },

    async listAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        res.json({ projects: await service.listAll() });
      } catch (err) {
        next(err);
      }
    },

    async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        res.json({ project: await service.getById(parseId(req.params['id'])) });
      } catch (err) {
        next(err);
      }
    },

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const project = await service.create(req.currentUser!.userId, req.body as ProjectInputDto);
        res.status(201).json({ project });
      } catch (err) {
        next(err);
      }
    },

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const id = parseId(req.params['id']);
        const project = await service.update(req.currentUser!.userId, id, req.body as ProjectInputDto);
        res.json({ project });
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

    async reorder(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        await service.reorder(req.currentUser!.userId, (req.body as ReorderDto).ids);
        res.status(204).end();
      } catch (err) {
        next(err);
      }
    },
  };
}

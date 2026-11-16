import type { Request, Response, NextFunction } from 'express';
import { parseId } from '../../shared/utils/params';
import type { PublicationService } from './publications.service';
import type { PublicationInputDto } from './publications.schema';

export function createPublicationController(service: PublicationService) {
  return {
    async listPublished(_req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        res.json({ publications: await service.listPublished() });
      } catch (err) {
        next(err);
      }
    },

    async listAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        res.json({ publications: await service.listAll() });
      } catch (err) {
        next(err);
      }
    },

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const publication = await service.create(req.currentUser!.userId, req.body as PublicationInputDto);
        res.status(201).json({ publication });
      } catch (err) {
        next(err);
      }
    },

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const id = parseId(req.params['id']);
        const publication = await service.update(req.currentUser!.userId, id, req.body as PublicationInputDto);
        res.json({ publication });
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

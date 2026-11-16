import type { Request, Response, NextFunction } from 'express';
import { parseId } from '../../shared/utils/params';
import type { MediaService } from './media.service';
import type { UpdateMediaDto } from './media.schema';

export function createMediaController(service: MediaService) {
  return {
    async upload(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const media = await service.upload(req.currentUser!.userId, req.file);
        res.status(201).json({ media });
      } catch (err) {
        next(err);
      }
    },

    async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const media = await service.list();
        res.json({ media });
      } catch (err) {
        next(err);
      }
    },

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const { alt } = req.body as UpdateMediaDto;
        const media = await service.updateAlt(req.currentUser!.userId, parseId(req.params['id']), alt);
        res.json({ media });
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

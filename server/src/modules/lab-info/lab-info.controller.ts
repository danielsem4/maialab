import type { Request, Response, NextFunction } from 'express';
import type { LabInfoService } from './lab-info.service';
import type { LabInfoInputDto } from './lab-info.schema';

export function createLabInfoController(service: LabInfoService) {
  return {
    async get(_req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        res.json({ labInfo: await service.get() });
      } catch (err) {
        next(err);
      }
    },

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const labInfo = await service.update(req.currentUser!.userId, req.body as LabInfoInputDto);
        res.json({ labInfo });
      } catch (err) {
        next(err);
      }
    },
  };
}

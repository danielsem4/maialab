import type { Request, Response, NextFunction } from 'express';
import type { DashboardService } from './dashboard.service';

export function createDashboardController(service: DashboardService) {
  return {
    async get(_req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        res.json(await service.get());
      } catch (err) {
        next(err);
      }
    },
  };
}

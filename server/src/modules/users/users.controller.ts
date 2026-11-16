import type { Request, Response, NextFunction } from 'express';
import { parseId } from '../../shared/utils/params';
import type { UserService } from './users.service';
import type { CreateUserDto, UpdateUserDto } from './users.schema';

export function createUserController(service: UserService) {
  return {
    async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        res.json({ users: await service.list() });
      } catch (err) {
        next(err);
      }
    },

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const user = await service.create(req.currentUser!.userId, req.body as CreateUserDto);
        res.status(201).json({ user });
      } catch (err) {
        next(err);
      }
    },

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const id = parseId(req.params['id']);
        const user = await service.update(req.currentUser!.userId, id, req.body as UpdateUserDto);
        res.json({ user });
      } catch (err) {
        next(err);
      }
    },
  };
}

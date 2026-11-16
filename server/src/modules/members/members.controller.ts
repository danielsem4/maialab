import type { Request, Response, NextFunction } from 'express';
import { parseId } from '../../shared/utils/params';
import type { MemberService } from './members.service';
import type { MemberInputDto, ReorderDto } from './members.schema';

export function createMemberController(service: MemberService) {
  return {
    async listPublished(_req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        res.json({ members: await service.listPublished() });
      } catch (err) {
        next(err);
      }
    },

    async listAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        res.json({ members: await service.listAll() });
      } catch (err) {
        next(err);
      }
    },

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const member = await service.create(req.currentUser!.userId, req.body as MemberInputDto);
        res.status(201).json({ member });
      } catch (err) {
        next(err);
      }
    },

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const id = parseId(req.params['id']);
        const member = await service.update(req.currentUser!.userId, id, req.body as MemberInputDto);
        res.json({ member });
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

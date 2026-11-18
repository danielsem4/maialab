import type { Request, Response, NextFunction } from 'express';
import { parseId } from '../../shared/utils/params';
import type { DeckService } from './decks.service';
import type { CreateDeckDto, UpdateDeckDto } from './decks.schema';

export function createDeckController(service: DeckService) {
  return {
    async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        res.json({ decks: await service.list() });
      } catch (err) {
        next(err);
      }
    },

    async get(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        res.json({ deck: await service.get(parseId(req.params['id'])) });
      } catch (err) {
        next(err);
      }
    },

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const deck = await service.create(req.currentUser!.userId, req.body as CreateDeckDto);
        res.status(201).json({ deck });
      } catch (err) {
        next(err);
      }
    },

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const id = parseId(req.params['id']);
        const deck = await service.update(req.currentUser!.userId, id, req.body as UpdateDeckDto);
        res.json({ deck });
      } catch (err) {
        next(err);
      }
    },

    async duplicate(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const deck = await service.duplicate(req.currentUser!.userId, parseId(req.params['id']));
        res.status(201).json({ deck });
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

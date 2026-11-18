import { Router } from 'express';
import { requireAdmin } from '../../shared/middlewares/requireAdmin';
import { validateRequest } from '../../shared/middlewares/validateRequest';
import { DeckRepository } from './decks.repository';
import { DeckService } from './decks.service';
import { createDeckController } from './decks.controller';
import { createDeckSchema, updateDeckSchema } from './decks.schema';

const repository = new DeckRepository();
const service = new DeckService(repository);
const controller = createDeckController(service);

export const decksAdminRouter = Router();

decksAdminRouter.use(requireAdmin);
decksAdminRouter.get('/', controller.list);
decksAdminRouter.get('/:id', controller.get);
decksAdminRouter.post('/', validateRequest(createDeckSchema), controller.create);
decksAdminRouter.patch('/:id', validateRequest(updateDeckSchema), controller.update);
decksAdminRouter.post('/:id/duplicate', controller.duplicate);
decksAdminRouter.delete('/:id', controller.remove);

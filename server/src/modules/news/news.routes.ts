import { Router } from 'express';
import { requireAdmin } from '../../shared/middlewares/requireAdmin';
import { validateRequest } from '../../shared/middlewares/validateRequest';
import { NewsRepository } from './news.repository';
import { NewsService } from './news.service';
import { createNewsController } from './news.controller';
import { newsInputSchema } from './news.schema';

const repository = new NewsRepository();
const service = new NewsService(repository);
const controller = createNewsController(service);

export const newsRouter = Router();

newsRouter.get('/', controller.listPublished);
newsRouter.get('/:slug', controller.getPublished);

export const newsAdminRouter = Router();

newsAdminRouter.use(requireAdmin);
newsAdminRouter.get('/', controller.listAll);
newsAdminRouter.post('/', validateRequest(newsInputSchema), controller.create);
newsAdminRouter.get('/:id', controller.getById);
newsAdminRouter.patch('/:id', validateRequest(newsInputSchema), controller.update);
newsAdminRouter.delete('/:id', controller.remove);

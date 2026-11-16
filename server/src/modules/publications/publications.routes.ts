import { Router } from 'express';
import { requireAdmin } from '../../shared/middlewares/requireAdmin';
import { validateRequest } from '../../shared/middlewares/validateRequest';
import { PublicationRepository } from './publications.repository';
import { PublicationService } from './publications.service';
import { createPublicationController } from './publications.controller';
import { publicationInputSchema } from './publications.schema';

const repository = new PublicationRepository();
const service = new PublicationService(repository);
const controller = createPublicationController(service);

export const publicationsRouter = Router();

publicationsRouter.get('/', controller.listPublished);

export const publicationsAdminRouter = Router();

publicationsAdminRouter.use(requireAdmin);
publicationsAdminRouter.get('/', controller.listAll);
publicationsAdminRouter.post('/', validateRequest(publicationInputSchema), controller.create);
publicationsAdminRouter.patch('/:id', validateRequest(publicationInputSchema), controller.update);
publicationsAdminRouter.delete('/:id', controller.remove);

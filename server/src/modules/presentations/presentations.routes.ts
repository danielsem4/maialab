import { Router } from 'express';
import { requireAdmin } from '../../shared/middlewares/requireAdmin';
import { validateRequest } from '../../shared/middlewares/validateRequest';
import { PresentationRepository } from './presentations.repository';
import { PresentationService } from './presentations.service';
import { createPresentationController } from './presentations.controller';
import { labDeckSchema } from './presentations.schema';

const repository = new PresentationRepository();
const service = new PresentationService(repository);
const controller = createPresentationController(service);

export const presentationsAdminRouter = Router();

presentationsAdminRouter.use(requireAdmin);
presentationsAdminRouter.get('/projects/:id', controller.projectDeck);
presentationsAdminRouter.post('/lab', validateRequest(labDeckSchema), controller.labDeck);

import { Router } from 'express';
import { requireAdmin } from '../../shared/middlewares/requireAdmin';
import { validateRequest } from '../../shared/middlewares/validateRequest';
import { ProjectRepository } from './projects.repository';
import { ProjectService } from './projects.service';
import { createProjectController } from './projects.controller';
import { projectInputSchema, reorderSchema } from './projects.schema';

const repository = new ProjectRepository();
const service = new ProjectService(repository);
const controller = createProjectController(service);

export const projectsRouter = Router();

projectsRouter.get('/', controller.listPublished);
projectsRouter.get('/:slug', controller.getPublished);

export const projectsAdminRouter = Router();

projectsAdminRouter.use(requireAdmin);
projectsAdminRouter.get('/', controller.listAll);
projectsAdminRouter.post('/', validateRequest(projectInputSchema), controller.create);
projectsAdminRouter.patch('/reorder', validateRequest(reorderSchema), controller.reorder);
projectsAdminRouter.get('/:id', controller.getById);
projectsAdminRouter.patch('/:id', validateRequest(projectInputSchema), controller.update);
projectsAdminRouter.delete('/:id', controller.remove);

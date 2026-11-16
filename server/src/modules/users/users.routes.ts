import { Router } from 'express';
import { requireSuperAdmin } from '../../shared/middlewares/requireAdmin';
import { validateRequest } from '../../shared/middlewares/validateRequest';
import { UserRepository } from './users.repository';
import { UserService } from './users.service';
import { createUserController } from './users.controller';
import { createUserSchema, updateUserSchema } from './users.schema';

const repository = new UserRepository();
const service = new UserService(repository);
const controller = createUserController(service);

export const usersAdminRouter = Router();

usersAdminRouter.use(requireSuperAdmin);
usersAdminRouter.get('/', controller.list);
usersAdminRouter.post('/', validateRequest(createUserSchema), controller.create);
usersAdminRouter.patch('/:id', validateRequest(updateUserSchema), controller.update);

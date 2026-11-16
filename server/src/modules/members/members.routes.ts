import { Router } from 'express';
import { requireAdmin } from '../../shared/middlewares/requireAdmin';
import { validateRequest } from '../../shared/middlewares/validateRequest';
import { MemberRepository } from './members.repository';
import { MemberService } from './members.service';
import { createMemberController } from './members.controller';
import { memberInputSchema, reorderSchema } from './members.schema';

const repository = new MemberRepository();
const service = new MemberService(repository);
const controller = createMemberController(service);

export const membersRouter = Router();

membersRouter.get('/', controller.listPublished);

export const membersAdminRouter = Router();

membersAdminRouter.use(requireAdmin);
membersAdminRouter.get('/', controller.listAll);
membersAdminRouter.post('/', validateRequest(memberInputSchema), controller.create);
membersAdminRouter.patch('/reorder', validateRequest(reorderSchema), controller.reorder);
membersAdminRouter.patch('/:id', validateRequest(memberInputSchema), controller.update);
membersAdminRouter.delete('/:id', controller.remove);

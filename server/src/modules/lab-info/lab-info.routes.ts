import { Router } from 'express';
import { requireAdmin } from '../../shared/middlewares/requireAdmin';
import { validateRequest } from '../../shared/middlewares/validateRequest';
import { LabInfoRepository } from './lab-info.repository';
import { LabInfoService } from './lab-info.service';
import { createLabInfoController } from './lab-info.controller';
import { labInfoInputSchema } from './lab-info.schema';

const repository = new LabInfoRepository();
const service = new LabInfoService(repository);
const controller = createLabInfoController(service);

export const labInfoRouter = Router();

labInfoRouter.get('/', controller.get);

export const labInfoAdminRouter = Router();

labInfoAdminRouter.use(requireAdmin);
labInfoAdminRouter.put('/', validateRequest(labInfoInputSchema), controller.update);

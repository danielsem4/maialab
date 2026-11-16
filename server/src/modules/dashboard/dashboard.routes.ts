import { Router } from 'express';
import { requireAdmin } from '../../shared/middlewares/requireAdmin';
import { DashboardRepository } from './dashboard.repository';
import { DashboardService } from './dashboard.service';
import { createDashboardController } from './dashboard.controller';

const repository = new DashboardRepository();
const service = new DashboardService(repository);
const controller = createDashboardController(service);

export const dashboardAdminRouter = Router();

dashboardAdminRouter.use(requireAdmin);
dashboardAdminRouter.get('/', controller.get);

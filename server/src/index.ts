import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import prisma from './lib/prisma';
import { authRouter } from './modules/auth/auth.routes';
import { labInfoRouter, labInfoAdminRouter } from './modules/lab-info/lab-info.routes';
import { usersAdminRouter } from './modules/users/users.routes';
import { dashboardAdminRouter } from './modules/dashboard/dashboard.routes';
import { newsRouter, newsAdminRouter } from './modules/news/news.routes';
import { membersRouter, membersAdminRouter } from './modules/members/members.routes';
import { publicationsRouter, publicationsAdminRouter } from './modules/publications/publications.routes';
import { presentationsAdminRouter } from './modules/presentations/presentations.routes';
import { mediaAdminRouter } from './modules/media/media.routes';
import { projectsRouter, projectsAdminRouter } from './modules/projects/projects.routes';
import { UPLOAD_DIR, UPLOAD_URL_PREFIX } from './shared/storage/localStorage';
import { errorHandler } from './shared/middlewares/errorHandler';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// Uploaded images are embedded by the client (dev proxy / separate origin).
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: process.env['CLIENT_URL'] || 'http://localhost:5173',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Uploaded media (public, immutable random filenames)
app.use(UPLOAD_URL_PREFIX, express.static(UPLOAD_DIR, { maxAge: '30d', immutable: true, index: false }));

// Public routes
app.use('/api/auth', authRouter);
app.use('/api/lab-info', labInfoRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/news', newsRouter);
app.use('/api/members', membersRouter);
app.use('/api/publications', publicationsRouter);

// Admin routes (each router applies requireAdmin)
app.use('/api/admin/lab-info', labInfoAdminRouter);
app.use('/api/admin/media', mediaAdminRouter);
app.use('/api/admin/users', usersAdminRouter);
app.use('/api/admin/dashboard', dashboardAdminRouter);
app.use('/api/admin/presentations', presentationsAdminRouter);
app.use('/api/admin/projects', projectsAdminRouter);
app.use('/api/admin/news', newsAdminRouter);
app.use('/api/admin/members', membersAdminRouter);
app.use('/api/admin/publications', publicationsAdminRouter);

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export { prisma };
export default app;

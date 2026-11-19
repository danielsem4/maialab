import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
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
import { mediaAdminRouter } from './modules/media/media.routes';
import { projectsRouter, projectsAdminRouter } from './modules/projects/projects.routes';
import { UPLOAD_DIR, UPLOAD_URL_PREFIX } from './shared/storage/localStorage';
import { usesLocalStorage } from './shared/storage';
import { errorHandler } from './shared/middlewares/errorHandler';

const app = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env['NODE_ENV'] === 'production';
const CLIENT_DIST_DIR = path.resolve(__dirname, '../../client/dist');
const mediaOrigin = process.env['R2_PUBLIC_URL'] ? new URL(process.env['R2_PUBLIC_URL']).origin : null;

// Middleware
// Uploaded images are embedded by the client (dev proxy / separate origin).
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      'img-src': ["'self'", 'data:', 'blob:', ...(mediaOrigin ? [mediaOrigin] : [])],
    },
  },
}));
app.set('trust proxy', 1);
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

// Uploaded media (public, immutable random filenames); R2 serves its own files
if (usesLocalStorage) {
  app.use(UPLOAD_URL_PREFIX, express.static(UPLOAD_DIR, { maxAge: '30d', immutable: true, index: false }));
}

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
app.use('/api/admin/projects', projectsAdminRouter);
app.use('/api/admin/news', newsAdminRouter);
app.use('/api/admin/members', membersAdminRouter);
app.use('/api/admin/publications', publicationsAdminRouter);

// In production the built client is served from the same origin as the API
// (the auth cookie is SameSite=Strict).
if (isProd) {
  app.use(express.static(CLIENT_DIST_DIR, { index: false }));
  app.get(/^\/(?!api\/|uploads\/).*/, (_req: Request, res: Response) => {
    res.sendFile(path.join(CLIENT_DIST_DIR, 'index.html'));
  });
}

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export { prisma };
export default app;

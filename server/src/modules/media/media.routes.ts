import crypto from 'crypto';
import { Router, type Request, type Response, type NextFunction } from 'express';
import multer from 'multer';
import { handleUpload as handleBlobUpload, type HandleUploadBody } from '@vercel/blob/client';
import { AppError } from '../../shared/errors/AppError';
import { requireAdmin } from '../../shared/middlewares/requireAdmin';
import { validateRequest } from '../../shared/middlewares/validateRequest';
import { storage, usesLocalStorage } from '../../shared/storage';
import { UPLOAD_DIR } from '../../shared/storage/localStorage';
import { MediaRepository } from './media.repository';
import { MediaService } from './media.service';
import { createMediaController } from './media.controller';
import {
  ALLOWED_MIME_TYPES,
  MAX_UPLOAD_BYTES,
  MAX_VIDEO_BYTES,
  VIDEO_FILENAME_PATTERN,
  VIDEO_MIME_TYPES,
  registerVideoSchema,
  updateMediaSchema,
} from './media.schema';

const repository = new MediaRepository();
const service = new MediaService(repository, storage);
const controller = createMediaController(service, !usesLocalStorage);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES[file.mimetype]) cb(null, true);
    else cb(new AppError('Unsupported file type', 400));
  },
});

// Local storage only: videos stream to disk instead of being buffered in memory.
const videoUpload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (_req, file, cb) => cb(null, `${crypto.randomUUID()}${VIDEO_MIME_TYPES[file.mimetype]}`),
  }),
  limits: { fileSize: MAX_VIDEO_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (VIDEO_MIME_TYPES[file.mimetype]) cb(null, true);
    else cb(new AppError('Unsupported video type', 400));
  },
});

function single(uploader: multer.Multer, tooLarge: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    uploader.single('file')(req, res, (err: unknown) => {
      if (err instanceof multer.MulterError) {
        next(new AppError(err.code === 'LIMIT_FILE_SIZE' ? tooLarge : err.message, 400));
        return;
      }
      next(err);
    });
  };
}

const handleUpload = single(upload, 'File is larger than 4 MB');
const handleVideoFile = single(videoUpload, 'Video is larger than 100 MB');

/** Issues a short-lived token that lets the browser send one video straight to Vercel Blob. */
async function videoToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await handleBlobUpload({
      request: req,
      body: req.body as HandleUploadBody,
      onBeforeGenerateToken: async (pathname) => {
        if (!VIDEO_FILENAME_PATTERN.test(pathname)) throw new AppError('Invalid video file name', 400);
        return {
          allowedContentTypes: Object.keys(VIDEO_MIME_TYPES),
          maximumSizeInBytes: MAX_VIDEO_BYTES,
          addRandomSuffix: false,
        };
      },
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export const mediaAdminRouter = Router();

mediaAdminRouter.use(requireAdmin);
mediaAdminRouter.get('/', controller.list);
mediaAdminRouter.post('/', handleUpload, controller.upload);
mediaAdminRouter.get('/upload-config', controller.uploadConfig);
if (usesLocalStorage) {
  mediaAdminRouter.post('/video-file', handleVideoFile, controller.uploadVideoFile);
} else {
  mediaAdminRouter.post('/video-token', videoToken);
  mediaAdminRouter.post('/video', validateRequest(registerVideoSchema), controller.registerVideo);
}
mediaAdminRouter.patch('/:id', validateRequest(updateMediaSchema), controller.update);
mediaAdminRouter.delete('/:id', controller.remove);

import { Router, type Request, type Response, type NextFunction } from 'express';
import multer from 'multer';
import { AppError } from '../../shared/errors/AppError';
import { requireAdmin } from '../../shared/middlewares/requireAdmin';
import { validateRequest } from '../../shared/middlewares/validateRequest';
import { storage } from '../../shared/storage';
import { MediaRepository } from './media.repository';
import { MediaService } from './media.service';
import { createMediaController } from './media.controller';
import { ALLOWED_MIME_TYPES, MAX_UPLOAD_BYTES, updateMediaSchema } from './media.schema';

const repository = new MediaRepository();
const service = new MediaService(repository, storage);
const controller = createMediaController(service);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES[file.mimetype]) cb(null, true);
    else cb(new AppError('Unsupported file type', 400));
  },
});

function handleUpload(req: Request, res: Response, next: NextFunction): void {
  upload.single('file')(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError) {
      const message = err.code === 'LIMIT_FILE_SIZE' ? 'File is larger than 10 MB' : err.message;
      next(new AppError(message, 400));
      return;
    }
    next(err);
  });
}

export const mediaAdminRouter = Router();

mediaAdminRouter.use(requireAdmin);
mediaAdminRouter.get('/', controller.list);
mediaAdminRouter.post('/', handleUpload, controller.upload);
mediaAdminRouter.patch('/:id', validateRequest(updateMediaSchema), controller.update);
mediaAdminRouter.delete('/:id', controller.remove);

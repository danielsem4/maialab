import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/errors/AppError';
import { parseId } from '../../shared/utils/params';
import type { MediaService } from './media.service';
import { MAX_VIDEO_BYTES, videoDetailsSchema, type RegisterVideoDto, type UpdateMediaDto } from './media.schema';

export function createMediaController(service: MediaService, directUpload: boolean) {
  return {
    uploadConfig(_req: Request, res: Response): void {
      res.json({ directUpload, maxVideoBytes: MAX_VIDEO_BYTES });
    },

    /** Registers a video the browser has already sent straight to the store. */
    async registerVideo(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const media = await service.registerVideo(req.currentUser!.userId, req.body as RegisterVideoDto);
        res.status(201).json({ media });
      } catch (err) {
        next(err);
      }
    },

    /** Local storage only: the video arrived as a file and is already on disk. */
    async uploadVideoFile(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        if (!req.file) throw new AppError('No file uploaded', 400);
        const details = videoDetailsSchema.safeParse({ ...req.body, originalName: req.file.originalname });
        if (!details.success) throw new AppError('Invalid video details', 400);
        const media = await service.registerVideo(req.currentUser!.userId, {
          ...details.data,
          filename: req.file.filename,
        });
        res.status(201).json({ media });
      } catch (err) {
        next(err);
      }
    },

    async upload(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const media = await service.upload(req.currentUser!.userId, req.file);
        res.status(201).json({ media });
      } catch (err) {
        next(err);
      }
    },

    async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const media = await service.list();
        res.json({ media });
      } catch (err) {
        next(err);
      }
    },

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const { alt } = req.body as UpdateMediaDto;
        const media = await service.updateAlt(req.currentUser!.userId, parseId(req.params['id']), alt);
        res.json({ media });
      } catch (err) {
        next(err);
      }
    },

    async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        await service.remove(req.currentUser!.userId, parseId(req.params['id']));
        res.status(204).end();
      } catch (err) {
        next(err);
      }
    },
  };
}

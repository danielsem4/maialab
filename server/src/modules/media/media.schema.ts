import { z } from 'zod';

export const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'application/pdf': '.pdf',
};

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // Vercel caps request bodies at 4.5 MB

// Videos are too big for a function request body, so they bypass it: straight to Blob in production, to disk locally.
export const VIDEO_MIME_TYPES: Record<string, string> = {
  'video/mp4': '.mp4',
  'video/webm': '.webm',
};

export const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

/** Names the server accepts for a directly uploaded video: a random UUID plus an allowed extension. */
export const VIDEO_FILENAME_PATTERN = /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}\.(mp4|webm)$/;

const dimension = z.coerce.number().int().positive().max(20000).nullable().default(null);

export const videoDetailsSchema = z.object({
  originalName: z.string().min(1).max(200),
  width: dimension,
  height: dimension,
});

export const registerVideoSchema = videoDetailsSchema.extend({
  filename: z.string().regex(VIDEO_FILENAME_PATTERN, 'Invalid video file name'),
});

export type VideoDetailsDto = z.infer<typeof videoDetailsSchema>;
export type RegisterVideoDto = z.infer<typeof registerVideoSchema>;

export const updateMediaSchema = z.object({
  alt: z.string().max(300),
});

export type UpdateMediaDto = z.infer<typeof updateMediaSchema>;

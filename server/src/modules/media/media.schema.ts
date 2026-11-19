import { z } from 'zod';

export const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'application/pdf': '.pdf',
};

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // Vercel caps request bodies at 4.5 MB

export const updateMediaSchema = z.object({
  alt: z.string().max(300),
});

export type UpdateMediaDto = z.infer<typeof updateMediaSchema>;

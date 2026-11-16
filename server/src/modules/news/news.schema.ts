import { z } from 'zod';

const slugPattern = /^[\p{Ll}\p{Lo}\p{N}]+(?:-[\p{Ll}\p{Lo}\p{N}]+)*$/u;

export const newsInputSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z.string().trim().max(80).regex(slugPattern).optional().or(z.literal('')),
  body: z.string().max(50000).default(''),
  date: z.coerce.date().optional(),
  coverMediaId: z.number().int().positive().nullable().optional(),
  published: z.boolean().default(false),
});

export type NewsInputDto = z.infer<typeof newsInputSchema>;

export const newsListQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).optional(),
});

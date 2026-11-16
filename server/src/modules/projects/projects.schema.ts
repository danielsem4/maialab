import { z } from 'zod';

const slugPattern = /^[\p{Ll}\p{Lo}\p{N}]+(?:-[\p{Ll}\p{Lo}\p{N}]+)*$/u;

const optionalDate = z.coerce.date().nullable().optional();

export const projectInputSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z.string().trim().max(80).regex(slugPattern).optional(),
  summary: z.string().max(1000).default(''),
  description: z.string().max(50000).default(''),
  status: z.enum(['ACTIVE', 'COMPLETED', 'PLANNED']).default('ACTIVE'),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  startDate: optionalDate,
  endDate: optionalDate,
  coverMediaId: z.number().int().positive().nullable().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  images: z
    .array(z.object({ mediaId: z.number().int().positive(), caption: z.string().max(300).default('') }))
    .max(50)
    .default([]),
  members: z
    .array(z.object({ memberId: z.number().int().positive(), role: z.string().max(100).default('') }))
    .max(100)
    .default([]),
});

export type ProjectInputDto = z.infer<typeof projectInputSchema>;

export const reorderSchema = z.object({
  ids: z.array(z.number().int().positive()).min(1),
});

export type ReorderDto = z.infer<typeof reorderSchema>;

import { z } from 'zod';
import { optionalHttpUrl } from '../../shared/utils/validation';

const optionalUrl = optionalHttpUrl.optional();

export const memberInputSchema = z.object({
  name: z.string().trim().min(1).max(150),
  title: z.string().trim().max(200).default(''),
  bio: z.string().max(20000).default(''),
  email: z
    .union([z.email().max(200), z.literal('')])
    .nullable()
    .optional()
    .transform((v) => v || null),
  links: z
    .object({
      website: optionalUrl,
      scholar: optionalUrl,
      linkedin: optionalUrl,
      github: optionalUrl,
    })
    .default({}),
  photoMediaId: z.number().int().positive().nullable().optional(),
  category: z.enum(['PI', 'STAFF', 'PHD', 'MSC', 'BSC', 'ALUMNI']).default('STAFF'),
  published: z.boolean().default(true),
});

export type MemberInputDto = z.infer<typeof memberInputSchema>;

export const reorderSchema = z.object({
  ids: z.array(z.number().int().positive()).min(1),
});

export type ReorderDto = z.infer<typeof reorderSchema>;

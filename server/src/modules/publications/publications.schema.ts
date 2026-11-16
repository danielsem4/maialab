import { z } from 'zod';
import { optionalHttpUrl } from '../../shared/utils/validation';

export const publicationInputSchema = z.object({
  title: z.string().trim().min(1).max(300),
  authors: z.string().trim().min(1).max(1000),
  venue: z.string().trim().max(300).default(''),
  year: z.number().int().min(1950).max(2100),
  url: optionalHttpUrl
    .nullable()
    .optional()
    .transform((v) => v || null),
  pdfMediaId: z.number().int().positive().nullable().optional(),
  projectId: z.number().int().positive().nullable().optional(),
  published: z.boolean().default(true),
});

export type PublicationInputDto = z.infer<typeof publicationInputSchema>;

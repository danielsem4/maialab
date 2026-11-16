import { z } from 'zod';
import { optionalHttpUrl } from '../../shared/utils/validation';

const optionalUrl = optionalHttpUrl.optional();

export const labInfoInputSchema = z.object({
  name: z.string().trim().min(1).max(150),
  tagline: z.string().max(300).default(''),
  about: z.string().max(20000).default(''),
  mission: z.string().max(10000).default(''),
  contactEmail: z.union([z.literal(''), z.string().email()]).default(''),
  address: z.string().max(500).default(''),
  mapUrl: optionalHttpUrl.default(''),
  socialLinks: z
    .object({
      website: optionalUrl,
      github: optionalUrl,
      linkedin: optionalUrl,
      twitter: optionalUrl,
      youtube: optionalUrl,
    })
    .default({}),
  logoMediaId: z.number().int().positive().nullable().default(null),
  heroMediaId: z.number().int().positive().nullable().default(null),
});

export type LabInfoInputDto = z.infer<typeof labInfoInputSchema>;

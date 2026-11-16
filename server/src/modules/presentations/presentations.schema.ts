import { z } from 'zod';

export const labDeckSchema = z.object({
  projectIds: z.array(z.number().int().positive()).min(1).max(30),
  includeTeam: z.boolean().default(true),
  includePublications: z.boolean().default(true),
});

export type LabDeckDto = z.infer<typeof labDeckSchema>;

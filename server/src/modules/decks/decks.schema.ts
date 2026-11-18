import { z } from 'zod';

const elementSchema = z.object({
  id: z.string().min(1).max(40),
  // Open set: later phases add element types without a server change.
  type: z.string().min(1).max(40),
  x: z.number().finite(),
  y: z.number().finite(),
  w: z.number().finite().min(1),
  h: z.number().finite().min(1),
  rotation: z.number().finite(),
  props: z.record(z.string(), z.unknown()),
});

const slideSchema = z.object({
  id: z.string().min(1).max(40),
  background: z.string().max(40).optional(),
  transition: z.enum(['none', 'fade', 'slide']),
  elements: z.array(elementSchema).max(200),
});

export const deckDocSchema = z.object({
  version: z.literal(1),
  theme: z.object({
    colors: z.record(z.string(), z.string().max(40)),
    fontHeading: z.string().max(80),
    fontBody: z.string().max(80),
  }),
  slides: z.array(slideSchema).min(1).max(200),
});

export type DeckDoc = z.infer<typeof deckDocSchema>;

const titleSchema = z.string().trim().min(1).max(200);

export const createDeckSchema = z.object({
  title: titleSchema,
  templateId: z.number().int().positive().optional(),
});

export type CreateDeckDto = z.infer<typeof createDeckSchema>;

export const updateDeckSchema = z.object({
  // The updatedAt the client last saw; a mismatch means someone else saved in between.
  updatedAt: z.iso.datetime(),
  title: titleSchema.optional(),
  doc: deckDocSchema.optional(),
  isTemplate: z.boolean().optional(),
});

export type UpdateDeckDto = z.infer<typeof updateDeckSchema>;

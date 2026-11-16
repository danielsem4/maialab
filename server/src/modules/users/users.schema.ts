import { z } from 'zod';

const adminRole = z.enum(['SUPER_ADMIN', 'ADMIN']);

export const createUserSchema = z.object({
  email: z.string().trim().email().max(200),
  name: z.string().trim().min(1).max(120),
  role: adminRole,
  password: z.string().min(8).max(200),
});

export const updateUserSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  role: adminRole.optional(),
  isActive: z.boolean().optional(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type AdminRole = z.infer<typeof adminRole>;

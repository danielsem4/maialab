import { z } from "zod";

export const credentialsSchema = z.object({
  email: z.string().trim().min(1, "validation.required").email("validation.invalidEmail"),
  password: z.string().min(1, "validation.required"),
});

export type CredentialsValues = z.infer<typeof credentialsSchema>;

import { z } from "zod";
import type { IAdminUserCreateInput } from "@/common/types/AdminUser";

export const userFormSchema = z.object({
  name: z.string().trim().min(1, "validation.required").max(120, "validation.tooLong"),
  email: z.string().trim().min(1, "validation.required").max(200, "validation.tooLong").email("validation.invalidEmail"),
  role: z.enum(["SUPER_ADMIN", "ADMIN"]),
  password: z.string().min(8, "validation.passwordMin").max(200, "validation.tooLong"),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

export const EMPTY_USER_FORM: UserFormValues = {
  name: "",
  email: "",
  role: "ADMIN",
  password: "",
};

export function formToUserInput(values: UserFormValues): IAdminUserCreateInput {
  return {
    name: values.name.trim(),
    email: values.email.trim().toLowerCase(),
    role: values.role,
    password: values.password,
  };
}

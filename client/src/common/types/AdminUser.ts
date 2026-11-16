export type AdminRole = "SUPER_ADMIN" | "ADMIN";

export const ADMIN_ROLES: AdminRole[] = ["SUPER_ADMIN", "ADMIN"];

export interface IAdminUser {
  id: number;
  email: string;
  name: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
}

export interface IAdminUserCreateInput {
  email: string;
  name: string;
  role: AdminRole;
  password: string;
}

export interface IAdminUserUpdateInput {
  name?: string;
  role?: AdminRole;
  isActive?: boolean;
}

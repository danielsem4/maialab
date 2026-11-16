import api from "@/lib/axios";
import type { IAdminUser, IAdminUserCreateInput, IAdminUserUpdateInput } from "@/common/types/AdminUser";

export const usersApi = {
  async list(): Promise<IAdminUser[]> {
    const { data } = await api.get<{ users: IAdminUser[] }>("/admin/users");
    return data.users;
  },

  async create(input: IAdminUserCreateInput): Promise<IAdminUser> {
    const { data } = await api.post<{ user: IAdminUser }>("/admin/users", input);
    return data.user;
  },

  async update(id: number, input: IAdminUserUpdateInput): Promise<IAdminUser> {
    const { data } = await api.patch<{ user: IAdminUser }>(`/admin/users/${id}`, input);
    return data.user;
  },
};

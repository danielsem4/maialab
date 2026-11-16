import api from "@/lib/axios";
import type { IMember, IMemberInput } from "@/common/types/Member";

export const membersApi = {
  async listPublished(): Promise<IMember[]> {
    const { data } = await api.get<{ members: IMember[] }>("/members");
    return data.members;
  },

  async listAll(): Promise<IMember[]> {
    const { data } = await api.get<{ members: IMember[] }>("/admin/members");
    return data.members;
  },

  async create(input: IMemberInput): Promise<IMember> {
    const { data } = await api.post<{ member: IMember }>("/admin/members", input);
    return data.member;
  },

  async update(id: number, input: IMemberInput): Promise<IMember> {
    const { data } = await api.patch<{ member: IMember }>(`/admin/members/${id}`, input);
    return data.member;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/admin/members/${id}`);
  },

  async reorder(ids: number[]): Promise<void> {
    await api.patch("/admin/members/reorder", { ids });
  },
};

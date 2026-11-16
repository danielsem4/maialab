import api from "@/lib/axios";
import type { IPublication, IPublicationInput } from "@/common/types/Publication";

export const publicationsApi = {
  async listPublished(): Promise<IPublication[]> {
    const { data } = await api.get<{ publications: IPublication[] }>("/publications");
    return data.publications;
  },

  async listAll(): Promise<IPublication[]> {
    const { data } = await api.get<{ publications: IPublication[] }>("/admin/publications");
    return data.publications;
  },

  async create(input: IPublicationInput): Promise<IPublication> {
    const { data } = await api.post<{ publication: IPublication }>("/admin/publications", input);
    return data.publication;
  },

  async update(id: number, input: IPublicationInput): Promise<IPublication> {
    const { data } = await api.patch<{ publication: IPublication }>(`/admin/publications/${id}`, input);
    return data.publication;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/admin/publications/${id}`);
  },
};

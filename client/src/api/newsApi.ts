import api from "@/lib/axios";
import type { INewsPost, INewsPostInput } from "@/common/types/NewsPost";

export const newsApi = {
  async listPublished(limit?: number): Promise<INewsPost[]> {
    const { data } = await api.get<{ posts: INewsPost[] }>("/news", { params: limit ? { limit } : undefined });
    return data.posts;
  },

  async getPublished(slug: string): Promise<INewsPost> {
    const { data } = await api.get<{ post: INewsPost }>(`/news/${encodeURIComponent(slug)}`);
    return data.post;
  },

  async listAll(): Promise<INewsPost[]> {
    const { data } = await api.get<{ posts: INewsPost[] }>("/admin/news");
    return data.posts;
  },

  async get(id: number): Promise<INewsPost> {
    const { data } = await api.get<{ post: INewsPost }>(`/admin/news/${id}`);
    return data.post;
  },

  async create(input: INewsPostInput): Promise<INewsPost> {
    const { data } = await api.post<{ post: INewsPost }>("/admin/news", input);
    return data.post;
  },

  async update(id: number, input: INewsPostInput): Promise<INewsPost> {
    const { data } = await api.patch<{ post: INewsPost }>(`/admin/news/${id}`, input);
    return data.post;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/admin/news/${id}`);
  },
};

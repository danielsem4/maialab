import api from "@/lib/axios";
import type { IMedia } from "@/common/types/Media";

export const mediaApi = {
  async list(): Promise<IMedia[]> {
    const { data } = await api.get<{ media: IMedia[] }>("/admin/media");
    return data.media;
  },

  async upload(file: File): Promise<IMedia> {
    const form = new FormData();
    form.append("file", file);
    const { data } = await api.post<{ media: IMedia }>("/admin/media", form);
    return data.media;
  },

  async updateAlt(id: number, alt: string): Promise<IMedia> {
    const { data } = await api.patch<{ media: IMedia }>(`/admin/media/${id}`, { alt });
    return data.media;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/admin/media/${id}`);
  },
};

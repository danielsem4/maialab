import api from "@/lib/axios";
import type { IMedia } from "@/common/types/Media";

export interface IUploadConfig {
  /** True when videos go straight from the browser to blob storage instead of through the API. */
  directUpload: boolean;
  maxVideoBytes: number;
}

export interface IVideoUpload {
  file: File;
  width: number | null;
  height: number | null;
  onProgress: (percent: number) => void;
}

const VIDEO_EXTENSIONS: Record<string, string> = { "video/mp4": ".mp4", "video/webm": ".webm" };

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

  /**
   * Videos are too large for an API request in production, so there the browser sends the file straight to
   * blob storage with a one-off token from the API and then registers it; locally it is a plain file upload.
   */
  async uploadVideo({ file, width, height, onProgress }: IVideoUpload): Promise<IMedia> {
    const { data: config } = await api.get<IUploadConfig>("/admin/media/upload-config");

    if (!config.directUpload) {
      const form = new FormData();
      form.append("file", file);
      if (width && height) {
        form.append("width", String(width));
        form.append("height", String(height));
      }
      const { data } = await api.post<{ media: IMedia }>("/admin/media/video-file", form, {
        onUploadProgress: (event) => onProgress(Math.round((event.loaded / (event.total ?? file.size)) * 100)),
      });
      return data.media;
    }

    const { upload } = await import("@vercel/blob/client");
    const filename = `${crypto.randomUUID()}${VIDEO_EXTENSIONS[file.type]}`;
    await upload(filename, file, {
      access: "public",
      contentType: file.type,
      multipart: true,
      handleUploadUrl: `${api.defaults.baseURL}/admin/media/video-token`,
      onUploadProgress: (event) => onProgress(Math.round(event.percentage)),
    });
    const { data } = await api.post<{ media: IMedia }>("/admin/media/video", {
      filename,
      originalName: file.name,
      width,
      height,
    });
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

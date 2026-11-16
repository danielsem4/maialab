export interface IMedia {
  id: number;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  alt: string;
  createdAt: string;
}

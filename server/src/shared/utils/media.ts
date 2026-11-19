import { storage } from '../storage';

export interface MediaRecord {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  alt: string;
  createdAt: Date;
}

export interface MediaDto {
  id: number;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  alt: string;
  createdAt: Date;
}

export function toMediaDto(media: MediaRecord): MediaDto;
export function toMediaDto(media: MediaRecord | null | undefined): MediaDto | null;
export function toMediaDto(media: MediaRecord | null | undefined): MediaDto | null {
  if (!media) return null;
  return {
    id: media.id,
    url: storage.publicUrl(media.filename),
    originalName: media.originalName,
    mimeType: media.mimeType,
    size: media.size,
    width: media.width,
    height: media.height,
    alt: media.alt,
    createdAt: media.createdAt,
  };
}

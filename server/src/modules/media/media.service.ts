import path from 'path';
import { imageSize } from 'image-size';
import { AppError } from '../../shared/errors/AppError';
import type { IStorage } from '../../shared/storage/IStorage';
import { recordAudit } from '../../shared/utils/audit';
import { toMediaDto, type MediaDto } from '../../shared/utils/media';
import type { IMediaRepository } from './media.repository';
import { ALLOWED_MIME_TYPES } from './media.schema';

export interface UploadedFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

function readDimensions(file: UploadedFile): { width: number | null; height: number | null } {
  if (!file.mimetype.startsWith('image/')) return { width: null, height: null };
  try {
    const { width, height } = imageSize(file.buffer);
    return { width: width ?? null, height: height ?? null };
  } catch {
    throw new AppError('The image file could not be read', 400);
  }
}

export class MediaService {
  constructor(
    private readonly repository: IMediaRepository,
    private readonly storage: IStorage,
  ) {}

  async upload(userId: number, file: UploadedFile | undefined): Promise<MediaDto> {
    if (!file) throw new AppError('No file uploaded', 400);
    const extension = ALLOWED_MIME_TYPES[file.mimetype];
    if (!extension) throw new AppError('Unsupported file type', 400);

    const dimensions = readDimensions(file);
    const stored = await this.storage.save(file.buffer, extension);
    const media = await this.repository.create({
      filename: stored.filename,
      originalName: path.basename(file.originalname).slice(0, 200),
      mimeType: file.mimetype,
      size: stored.size,
      ...dimensions,
      uploadedById: userId,
    });
    await recordAudit(userId, 'CREATE', 'Media', media.id);
    return toMediaDto(media);
  }

  async list(): Promise<MediaDto[]> {
    const media = await this.repository.findAll();
    return media.map((m) => toMediaDto(m));
  }

  async updateAlt(userId: number, id: number, alt: string): Promise<MediaDto> {
    await this.getOrThrow(id);
    const media = await this.repository.updateAlt(id, alt);
    await recordAudit(userId, 'UPDATE', 'Media', id);
    return toMediaDto(media);
  }

  async remove(userId: number, id: number): Promise<void> {
    const media = await this.getOrThrow(id);
    const references = await this.repository.countReferences(id);
    if (references > 0) {
      throw new AppError('This file is still used by the site and cannot be deleted', 409);
    }
    await this.repository.delete(id);
    await this.storage.remove(media.filename);
    await recordAudit(userId, 'DELETE', 'Media', id, { originalName: media.originalName });
  }

  private async getOrThrow(id: number) {
    const media = await this.repository.findById(id);
    if (!media) throw new AppError('File not found', 404);
    return media;
  }
}

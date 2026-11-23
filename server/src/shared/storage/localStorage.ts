import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import type { FileInfo, IStorage, StoredFile } from './IStorage';

export const UPLOAD_DIR = path.resolve(process.env['UPLOAD_DIR'] || 'uploads');
export const UPLOAD_URL_PREFIX = '/uploads';

const CONTENT_TYPES: Record<string, string> = { '.mp4': 'video/mp4', '.webm': 'video/webm' };

export class LocalStorage implements IStorage {
  async save(buffer: Buffer, extension: string): Promise<StoredFile> {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const filename = `${crypto.randomUUID()}${extension.toLowerCase()}`;
    await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);
    return { filename, size: buffer.length };
  }

  async stat(filename: string): Promise<FileInfo | null> {
    const name = path.basename(filename);
    try {
      const { size } = await fs.stat(path.join(UPLOAD_DIR, name));
      return { size, contentType: CONTENT_TYPES[path.extname(name).toLowerCase()] ?? 'application/octet-stream' };
    } catch {
      return null;
    }
  }

  async remove(filename: string): Promise<void> {
    await fs.rm(path.join(UPLOAD_DIR, path.basename(filename)), { force: true });
  }

  publicUrl(filename: string): string {
    return `${UPLOAD_URL_PREFIX}/${filename}`;
  }
}

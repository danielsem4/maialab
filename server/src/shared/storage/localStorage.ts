import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import type { IStorage, StoredFile } from './IStorage';

export const UPLOAD_DIR = path.resolve(process.env['UPLOAD_DIR'] || 'uploads');
export const UPLOAD_URL_PREFIX = '/uploads';

export class LocalStorage implements IStorage {
  async save(buffer: Buffer, extension: string): Promise<StoredFile> {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const filename = `${crypto.randomUUID()}${extension.toLowerCase()}`;
    await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);
    return { filename, size: buffer.length };
  }

  async remove(filename: string): Promise<void> {
    await fs.rm(this.resolvePath(filename), { force: true });
  }

  resolvePath(filename: string): string {
    return path.join(UPLOAD_DIR, path.basename(filename));
  }

  publicUrl(filename: string): string {
    return `${UPLOAD_URL_PREFIX}/${filename}`;
  }
}

export const storage: IStorage = new LocalStorage();

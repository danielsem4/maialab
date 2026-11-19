import crypto from 'crypto';
import path from 'path';
import { del, put } from '@vercel/blob';
import type { IStorage, StoredFile } from './IStorage';

const CONTENT_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.pdf': 'application/pdf',
};

// Vercel Blob (public store). Uses BLOB_READ_WRITE_TOKEN; files are served
// from the store's public URL, e.g. https://<store>.public.blob.vercel-storage.com
export class BlobStorage implements IStorage {
  constructor(private readonly baseUrl: string) {}

  async save(buffer: Buffer, extension: string): Promise<StoredFile> {
    const ext = extension.toLowerCase();
    const filename = `${crypto.randomUUID()}${ext}`;
    await put(filename, buffer, {
      access: 'public',
      addRandomSuffix: false,
      contentType: CONTENT_TYPES[ext] ?? 'application/octet-stream',
    });
    return { filename, size: buffer.length };
  }

  async remove(filename: string): Promise<void> {
    await del(this.publicUrl(path.basename(filename)));
  }

  publicUrl(filename: string): string {
    return `${this.baseUrl.replace(/\/+$/, '')}/${filename}`;
  }
}

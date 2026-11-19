import crypto from 'crypto';
import path from 'path';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import type { IStorage, StoredFile } from './IStorage';

const CONTENT_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.pdf': 'application/pdf',
};

export interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicUrl: string;
}

// Cloudflare R2 (S3-compatible). Files are served from the bucket's public URL.
export class R2Storage implements IStorage {
  private readonly client: S3Client;

  constructor(private readonly config: R2Config) {
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
    });
  }

  async save(buffer: Buffer, extension: string): Promise<StoredFile> {
    const ext = extension.toLowerCase();
    const filename = `${crypto.randomUUID()}${ext}`;
    await this.client.send(new PutObjectCommand({
      Bucket: this.config.bucket,
      Key: filename,
      Body: buffer,
      ContentType: CONTENT_TYPES[ext] ?? 'application/octet-stream',
      CacheControl: 'public, max-age=31536000, immutable',
    }));
    return { filename, size: buffer.length };
  }

  async remove(filename: string): Promise<void> {
    await this.client.send(new DeleteObjectCommand({ Bucket: this.config.bucket, Key: path.basename(filename) }));
  }

  publicUrl(filename: string): string {
    return `${this.config.publicUrl.replace(/\/+$/, '')}/${filename}`;
  }
}

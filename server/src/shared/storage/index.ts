import type { IStorage } from './IStorage';
import { BlobStorage } from './blobStorage';
import { LocalStorage } from './localStorage';

function createStorage(): IStorage {
  const baseUrl = process.env['BLOB_BASE_URL'];
  if (!baseUrl) return new LocalStorage();

  if (!process.env['BLOB_READ_WRITE_TOKEN']) {
    throw new Error('BLOB_BASE_URL is set but BLOB_READ_WRITE_TOKEN is missing');
  }
  return new BlobStorage(baseUrl);
}

export const storage: IStorage = createStorage();
export const usesLocalStorage = storage instanceof LocalStorage;

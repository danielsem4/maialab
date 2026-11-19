import type { IStorage } from './IStorage';
import { LocalStorage } from './localStorage';
import { R2Storage } from './r2Storage';

function createStorage(): IStorage {
  const bucket = process.env['R2_BUCKET'];
  if (!bucket) return new LocalStorage();

  const required = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_PUBLIC_URL'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) throw new Error(`R2_BUCKET is set but missing: ${missing.join(', ')}`);

  return new R2Storage({
    accountId: process.env['R2_ACCOUNT_ID']!,
    accessKeyId: process.env['R2_ACCESS_KEY_ID']!,
    secretAccessKey: process.env['R2_SECRET_ACCESS_KEY']!,
    bucket,
    publicUrl: process.env['R2_PUBLIC_URL']!,
  });
}

export const storage: IStorage = createStorage();
export const usesLocalStorage = storage instanceof LocalStorage;

export interface StoredFile {
  filename: string;
  size: number;
}

export interface IStorage {
  save(buffer: Buffer, extension: string): Promise<StoredFile>;
  remove(filename: string): Promise<void>;
  publicUrl(filename: string): string;
}

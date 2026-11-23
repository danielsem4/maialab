export interface StoredFile {
  filename: string;
  size: number;
}

export interface FileInfo {
  size: number;
  contentType: string;
}

export interface IStorage {
  save(buffer: Buffer, extension: string): Promise<StoredFile>;
  /** Size and type of a file that reached the store without going through `save`; null when it is not there. */
  stat(filename: string): Promise<FileInfo | null>;
  remove(filename: string): Promise<void>;
  publicUrl(filename: string): string;
}

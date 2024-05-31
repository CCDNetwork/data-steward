export enum StorageTypeId {
  Assets = 1,
  Images = 2,
  Files = 4,
}

export interface StorageFile {
  id: string;
  storageTypeId: StorageTypeId;
  name: string;
  url: string;
}

export interface Image {
  id: number;
  name: string;
  url: string;
  alt: string;
  buffer: any;
}

export interface StorageFileData {
  file: {
    id: number;
    name: string;
    url: string;
    buffer: ArrayBuffer;
  };
  type: StorageTypeId;
}

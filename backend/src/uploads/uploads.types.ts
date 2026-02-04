export type UploadedFilePayload = {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
};

export type UploadFileFilterPayload = {
  mimetype: string;
};

export type UploadFileFilterCallback = (error: Error | null, acceptFile: boolean) => void;

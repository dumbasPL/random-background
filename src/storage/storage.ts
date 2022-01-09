import {Readable} from 'stream';
import {LocalStorage} from './localStorage';
import {S3Storage} from './S3Storage';

export interface Storage {

  getImages(path: string): Promise<Array<string>>

  getImage(path: string): Promise<Readable>

}

export async function createStorage(): Promise<Storage> {
  if (process.env.S3_ENDPOINT) {
    if (!Number.isInteger(parseInt(process.env.S3_PORT))) {
      throw new Error(`S3_ENDPOINT is present but S3_PORT is missing/invalid`);
    }
    if (!process.env.S3_ACCESS_KEY) {
      throw new Error(`S3_ENDPOINT is present but S3_ACCESS_KEY is missing`);
    }
    if (!process.env.S3_SECRET_KEY) {
      throw new Error(`S3_ENDPOINT is present but S3_SECRET_KEY is missing`);
    }
    if (!process.env.S3_BUCKET_NAME) {
      throw new Error(`S3_ENDPOINT is present but S3_BUCKET_NAME is missing`);
    }
    const s3Storage = new S3Storage({
      endPoint: process.env.S3_ENDPOINT,
      port: parseInt(process.env.S3_PORT),
      useSSL: process.env.S3_USE_SSL == 'true',
      accessKey: process.env.S3_ACCESS_KEY,
      secretKey: process.env.S3_SECRET_KEY,
      region: process.env.S3_REGION ? process.env.S3_REGION : undefined,
    }, process.env.S3_BUCKET_NAME);
    await s3Storage.createBucket();
    return s3Storage;
  }

  const dataDir = process.env.DATA_DIR;
  if (!dataDir) {
    throw new Error('DATA_DIR is missing');
  }
  return new LocalStorage(dataDir);
}

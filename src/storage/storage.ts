import {Readable} from 'stream';
import {LocalStorage} from './localStorage';

export interface Storage {

  getImages(path: string): Promise<Array<string>>

  getImage(path: string): Promise<Readable>

}

export async function createStorage(): Promise<Storage> {
  const dataDir = process.env.DATA_DIR;
  if (!dataDir) {
    throw new Error('DATA_DIR is missing');
  }
  return new LocalStorage(dataDir);
}

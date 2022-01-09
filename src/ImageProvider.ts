import {Readable} from 'stream';
import {Storage} from './storage';
import * as mime from 'mime-types';
import * as fsPath from 'path';

interface ImageData {
  buffer: Buffer,
  type: string;
}

export class ImageProvider {

  private storage: Storage;

  constructor(storage: Storage) {
    this.storage = storage;
  }

  private stream2buffer(stream: Readable): Promise<Buffer> {
    return new Promise < Buffer >((resolve, reject) => {
      const buf: Array<any> = [];
      stream.on('data', chunk => buf.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(buf)));
      stream.on('error', err => reject(err));
    });
  }

  async getRandomImagePath(path: string): Promise<string> {
    // default to root path
    path = path ?? '.';

    // get images in selected folder
    const images = await this.storage.getImages(path);

    // make sure we have at least one
    if (images.length == 0) {
      throw new Error('No images available');
    }

    // pick a random image
    return images[Math.floor(Math.random() * images.length)];
  }

  async getImageData(path: string): Promise<ImageData> {
    // get a readable stream for this file
    const stream = await this.storage.getImage(path);

    const buffer = await this.stream2buffer(stream);

    // try to guess mime type from file extension
    const type = mime.contentType(fsPath.basename(path));

    // make sure mime is valid
    if (type == false || type == path) {
      throw new Error('Unable to get mime type for file: ' + path);
    }

    // return data
    return {
      buffer,
      type
    };
  }

}

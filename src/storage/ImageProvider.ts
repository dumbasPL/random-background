import {Readable} from 'stream';
import {Storage} from './storage';
import * as mime from 'mime-types';
import * as fsPath from 'path';

interface ImageData {
  stream: Readable,
  type: string;
}

export class ImageProvider {

  private storage: Storage;

  constructor(storage: Storage) {
    this.storage = storage;
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

    // try to guess mime type from file extension
    const type = mime.contentType(fsPath.basename(path));

    // make sure mime is valid
    if (type == false || type == path) {
      throw new Error('Unable to get mime type for file: ' + path);
    }

    // return data
    return {
      stream,
      type
    };
  }

}

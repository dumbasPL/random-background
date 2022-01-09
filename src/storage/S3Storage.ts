import {Storage} from '.';
import {Client, ClientOptions} from 'minio';
import {Readable} from 'stream';
import * as fsPath from 'path';

export class S3Storage implements Storage {

  private client: Client;

  private bucketName: string;

  constructor(options: ClientOptions, bucketName: string) {
    this.client = new Client(options);
    this.bucketName = bucketName;
  }

  async createBucket() {
    if (!await this.client.bucketExists(this.bucketName)) {
      console.log(`Bucket "${this.bucketName}" does not exist, creating new bucket`);
      this.client.makeBucket(this.bucketName, '');
    }
  }

  private listFiles(path: string): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
      const stream = this.client.listObjectsV2(this.bucketName, fsPath.relative('./', path) + '/');
      const files: Array<string> = [];
      stream.on('data', obj => files.push(obj.name));
      stream.on('error', reject);
      stream.on('end', () => resolve(files));
    });
  }

  async getImages(path: string): Promise<string[]> {
    return await this.listFiles(path);
  }

  async getImage(path: string): Promise<Readable> {
    console.log(path);

    return await this.client.getObject(this.bucketName, path);
  }

}

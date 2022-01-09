import {Storage} from '.';
import {promises as fs, createReadStream} from 'fs';
import {Readable} from 'stream';
import * as fsPath from 'path';

export class LocalStorage implements Storage {

  private baseDir: string;

  constructor(baseDir: string) {
    this.baseDir = fsPath.resolve(baseDir);
  }

  private checkPathValid(path: string): boolean {
    return path.indexOf(this.baseDir) === 0;
  }

  private getFullPath(path: string): string {
    const fullPath = fsPath.join(this.baseDir, path);
    if (!this.checkPathValid(fullPath)) {
      throw new Error('Invalid path');
    }
    return fullPath;
  }

  async getImages(path: string): Promise<string[]> {
    const fullPath = this.getFullPath(path);

    const files = await fs.readdir(fullPath, {withFileTypes: true});

    return files.filter(ent => ent.isFile()).map(ent => fsPath.relative(this.baseDir, fsPath.join(fullPath, ent.name)));
  }

  async getImage(path: string): Promise<Readable> {
    const fullPath = this.getFullPath(path);

    const stat = await fs.stat(fullPath);

    if (!stat.isFile()) {
      throw new Error(`File ${fullPath} not found`);
    }

    return createReadStream(fullPath);
  }

}

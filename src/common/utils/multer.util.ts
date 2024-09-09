import { Request } from 'express';
import { mkdirSync } from 'fs';
import { extname, join } from 'path';

import { diskStorage } from 'multer';
export type callBackDestination = (error: Error, destination: string) => void;

export type callBackFilename = (error: Error, filename: string) => void;

export type MulterFile = Express.Multer.File;

export function multerDestination(filedName: string) {
  return function (
    req: Request,
    file: MulterFile,
    callBack: callBackDestination,
  ): void {
    const path = join('public', 'uploads', filedName);
    mkdirSync(path, { recursive: true });
    callBack(null, path);
  };
}

export function multerFileName() {
  return function (
    req: Request,
    file: MulterFile,
    callBack: callBackFilename,
  ): void {
    const ext = extname(file.originalname);

    const filename = `${Date.now()}${ext}`;
    callBack(null, filename);
  };
}

export function MulterStorage(folderName: string) {
  return diskStorage({
    destination: multerDestination(folderName),
    filename: multerFileName(),
  });
}

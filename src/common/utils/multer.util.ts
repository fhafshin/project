import { Request } from 'express';
import { mkdirSync } from 'fs';
import { extname, join } from 'path';
import { ValidationMessage } from '../enums/message.enum';
import { BadRequestException } from '@nestjs/common';
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

export function multerFileName(extensions: string[]) {
  return function (
    req: Request,
    file: MulterFile,
    callBack: callBackFilename,
  ): void {
    const ext = extname(file.originalname);
    if (isValidImageFormat(ext, extensions)) {
      const filename = `${Date.now()}${ext}`;
      callBack(null, filename);
    } else {
      callBack(
        new BadRequestException(ValidationMessage.InvalidImageFormat),
        null,
      );
    }
  };
}

function isValidImageFormat(ext: string, extList: string[]) {
  return [...extList].includes(ext.toLowerCase());
}

export function MulterStorage(folderName: string, extensions: string[]) {
  return diskStorage({
    destination: multerDestination(folderName),
    filename: multerFileName(extensions),
  });
}

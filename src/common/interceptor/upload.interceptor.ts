import { FileInterceptor } from '@nestjs/platform-express';
import { MulterStorage } from '../utils/multer.util';

export function UploadFile(fieldName: string, fileName: string) {
  return class UploadUtility extends FileInterceptor(fieldName, {
    storage: MulterStorage(fileName, ['.jpg', '.jpeg', '.png']),
  }) {};
}

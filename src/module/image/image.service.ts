import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from './entity/image.entity';
import { Repository } from 'typeorm';
import { CreateImageDto } from './dto/imageDto';
import { MulterFile } from 'src/common/utils/multer.util';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { NotFoundMessage, PublicMessage } from 'src/common/enums/message.enum';

@Injectable({ scope: Scope.REQUEST })
export class ImageService {
  constructor(
    @InjectRepository(ImageEntity)
    private imageRepository: Repository<ImageEntity>,
    @Inject(REQUEST) private req: Request,
  ) {}

  async create(imageDto: CreateImageDto, image: MulterFile) {
    const location = image?.path?.slice(7);
    const { id: userId } = this.req.user;
    const { alt, name } = imageDto;
    await this.imageRepository.insert({
      alt: alt ?? name,
      name,
      userId,
      location,
    });

    return {
      message: PublicMessage.Created,
    };
  }

  async remove(id: number) {
    const image = await this.findOne(id);
    await this.imageRepository.remove(image);
    return { message: PublicMessage.Deleted };
  }

  findAll() {
    const { id: userId } = this.req.user;
    return this.imageRepository.find({
      where: { userId },
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const { id: userId } = this.req.user;
    const image = await this.imageRepository.findOne({
      where: { id, userId },
      order: { id: 'DESC' },
    });
    if (!image) throw new NotFoundException(NotFoundMessage.NotFoundImage);
    return image;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from './entity/image.entity';
import { Repository } from 'typeorm';
import { CreateImageDto } from './dto/imageDto';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(ImageEntity)
    private imageRepository: Repository<ImageEntity>,
  ) {}

  create(imageDto: CreateImageDto) {}

  remove(id: number) {}

  findAll() {}

  findOne(id: number) {}
}

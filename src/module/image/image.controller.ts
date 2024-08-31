import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/imageDto';

@Controller('/images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('/create')
  create(@Body() imageDto: CreateImageDto) {
    return this.imageService.create(imageDto);
  }

  @Delete('/remove')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.imageService.remove(id);
  }

  @Get('/')
  findAll() {
    return this.imageService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.imageService.findOne(id);
  }
}

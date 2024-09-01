import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/imageDto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { UploadFile } from 'src/common/interceptor/upload.interceptor';
import { MulterFile } from 'src/common/utils/multer.util';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
@ApiTags('image')
@Controller('/images')
@AuthDecorator()
export class ImageController {
  constructor(private readonly imageService: ImageService) {}
  @ApiConsumes(SwaggerConsumes.MultipartData)
  @UseInterceptors(UploadFile('image', 'images'))
  @Post('/create')
  create(@Body() imageDto: CreateImageDto, @UploadedFile() image: MulterFile) {
    return this.imageService.create(imageDto, image);
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

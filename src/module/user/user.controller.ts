import {
  Body,
  Controller,
  Get,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { ProfileDto } from './dto/create-profile-dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MulterStorage } from 'src/common/utils/multer.util';
import { authguard } from '../auth/guards/auth.guard';
import { ProfileImages } from './types/file';
import { UploadedOptionalFiles } from 'src/common/decorators/upload-file.decorator';

@Controller('/users')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  findAll() {
    return 'Hello World....';
  }
  @UseGuards(authguard)
  @ApiBearerAuth('Authorization')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'bg_image', maxCount: 1 },
        { name: 'image_profile', maxCount: 1 },
      ],
      {
        storage: MulterStorage('user-profile', ['.jpg', '.jpeg', '.png']),
      },
    ),
  )
  @ApiConsumes(SwaggerConsumes.MultipartData)
  @Put('/profile')
  changeProfile(
    @UploadedOptionalFiles()
    files: ProfileImages,
    @Body()
    data: ProfileDto,
  ) {
    console.log(files);
    return this.userService.changeProfile(files, data);
  }
  @UseGuards(authguard)
  @ApiBearerAuth('Authorization')
  @Get('/profile')
  profile() {
    return this.userService.profile();
  }
}

import { Body, Controller, Get, Put, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { ProfileDto } from './dto/create-profile-dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';

@Controller('/users')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  findAll() {
    return 'Hello World....';
  }
  @ApiConsumes(SwaggerConsumes.MultipartData)
  @Put('/profile')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'bg_image', maxCount: 1 },
      { name: 'image_profile', maxCount: 1 },
    ]),
  )
  changeProfile(@Body() data: ProfileDto) {
    return this.userService.changeProfile(data);
  }
}

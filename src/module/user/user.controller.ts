import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import {
  ChangeEmail,
  ChangePhone,
  ChangeUsernameDto,
  ProfileDto,
} from './dto/create-profile-dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MulterStorage } from 'src/common/utils/multer.util';
import { authguard } from '../auth/guards/auth.guard';
import { ProfileImages } from './types/file';
import { UploadedOptionalFiles } from 'src/common/decorators/upload-file.decorator';
import { Response } from 'express';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { CookiesOptionsToken } from 'src/common/utils/cookiesOptionsToken';
import { PublicMessage } from 'src/common/enums/message.enum';
import { CheckOtpDto } from '../auth/dto/auth.dto';
@UseGuards(authguard)
@ApiBearerAuth('Authorization')
@Controller('/users')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  findAll() {
    return 'Hello World....';
  }

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
  @Patch('/profile')
  changeProfile(
    @UploadedOptionalFiles()
    files: ProfileImages,
    @Body()
    data: ProfileDto,
  ) {
    console.log(files);
    return this.userService.changeProfile(files, data);
  }

  @Get('/profile')
  profile() {
    return this.userService.profile();
  }

  @Patch('/change-email')
  async changeEmail(@Body() data: ChangeEmail, @Res() res: Response) {
    const { code, token, message } = await this.userService.changeEmail(
      data.email,
    );
    if (message) return res.json({ message });

    res.cookie(CookieKeys.EmailOTP, token, CookiesOptionsToken());
    res.json({ code, message: PublicMessage.sendOtp });
  }

  @Patch('/change-phone')
  async changePhone(@Body() data: ChangePhone, @Res() res: Response) {
    const { code, token, message } = await this.userService.changePhone(
      data.phone,
    );
    if (message) return res.json({ message });

    res.cookie(CookieKeys.PhoneOTP, token, CookiesOptionsToken());
    res.json({ code, message: PublicMessage.sendOtp });
  }

  @Post('/verify-phone-otp')
  verifyPhone(@Body() data: CheckOtpDto) {
    return this.userService.verifyPhone(data.code);
  }

  @Post('/verify-email-otp')
  verifyEmail(@Body() data: CheckOtpDto) {
    return this.userService.verifyEmail(data.code);
  }
  @ApiConsumes(SwaggerConsumes.UrlEncoded)
  @Patch('/change-username')
  changeUsername(@Body() data: ChangeUsernameDto) {
    return this.userService.changeUsername(data.username);
  }
}

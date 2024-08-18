import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDto, CheckOtpDto } from './dto/auth.dto';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';
import { Request, Response } from 'express';
import { authguard } from './guards/auth.guard';
@Controller('/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  @Post('user-existence')
  async userExistence(@Body() data: AuthDto, @Res() res: Response) {
    return this.authService.userExistence(data, res);
  }
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  @Post('check-otp')
  async checkOtp(@Body() data: CheckOtpDto) {
    return this.authService.checkOtp(data.code);
  }
  @UseGuards(authguard)
  //@ApiBearerAuth('Authorization')
  @Get('check-login')
  checkLogin(@Req() req: Request) {
    return req.user;
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum';

@Controller('/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  @Post('user-existence')
  userExistence(@Body() data: AuthDto) {
    return this.authService.userExistence(data);
  }
}

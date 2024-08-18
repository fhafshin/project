import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, Length } from 'class-validator';
import { AuthType } from '../enums/type.enum';
import { AuthMethod } from '../enums/method.enum';

export class AuthDto {
  @ApiProperty()
  @IsString()
  @Length(5, 50)
  username: string;
  @ApiProperty({ enum: AuthType })
  @IsEnum(AuthType)
  type: AuthType;
  @ApiProperty({ enum: AuthMethod })
  @IsEnum(AuthMethod)
  method: AuthMethod;
}

export class CheckOtpDto {
  @ApiProperty()
  @IsString()
  @Length(5, 100)
  code: string;
}

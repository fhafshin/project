import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, Length } from 'class-validator';
import { Gender } from '../enums/gender.enum';

export class ProfileDto {
  @ApiPropertyOptional({ default: '' })
  @IsOptional()
  @Length(3, 50)
  nik_name: string;
  @ApiPropertyOptional()
  @Length(5, 200)
  bio: string;
  @ApiPropertyOptional({ format: 'binary' })
  image_profile: string;
  @ApiPropertyOptional({ format: 'binary' })
  bg_image: string;
  @ApiPropertyOptional({ enum: Gender })
  @IsEnum(Gender)
  gender: Gender;
  @ApiPropertyOptional()
  linkedin_profile: string;
  @ApiPropertyOptional()
  x_profile: string;
  @ApiPropertyOptional({ example: '2024-08-20T11:55:38.915Z' })
  birthday: Date;
  @ApiProperty()
  userId: number;
}

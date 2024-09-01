import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateImageDto {
  @ApiPropertyOptional()
  alt: string;
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty({ format: 'binary' })
  image: string;
}

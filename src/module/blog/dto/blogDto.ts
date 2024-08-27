import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, Length } from 'class-validator';
import { BlogStatus } from '../enum/status.enum';

export class CreateBlogDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(10, 150)
  title: string;
  @ApiProperty()
  @IsNotEmpty()
  @Length(10, 300)
  description: string;
  @ApiProperty()
  @IsNotEmpty()
  @Length(10)
  content: string;
  @ApiPropertyOptional({ format: 'binary' })
  @IsOptional()
  image: string;
  @ApiProperty({ enum: BlogStatus })
  @IsNotEmpty()
  status: BlogStatus;
  @ApiProperty()
  @IsNotEmpty()
  authorId: number;
  @ApiPropertyOptional()
  @IsOptional()
  slug: string;
  @ApiProperty()
  @IsNumber()
  time_for_study: number;
}

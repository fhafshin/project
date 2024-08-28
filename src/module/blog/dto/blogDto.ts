import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

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

  @ApiPropertyOptional()
  @IsOptional()
  slug: string;
  @ApiProperty()
  @IsString()
  time_for_study: string;
  @ApiProperty({ type: String, isArray: true })
  @IsArray()
  categories: string[] | string;
}

export class FilterBlogDto {
  @ApiPropertyOptional()
  @IsOptional()
  category: string;
  search: string;
}

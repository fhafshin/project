import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ type: 'string' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ type: 'integer' })
  @IsOptional()
  priority: number;
}

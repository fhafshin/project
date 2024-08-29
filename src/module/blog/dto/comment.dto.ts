import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  @Length(5)
  text: string;
  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  parentId: number;
  @ApiProperty()
  @IsNumberString()
  blogId: number;
}

import { ApiProperty } from '@nestjs/swagger';

export class CreateImageDto {
  @ApiProperty({ format: 'binary' })
  image: string;
}

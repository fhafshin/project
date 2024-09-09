import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserWalletDto {
  @IsString()
  phone: string;
  @IsString()
  fullName: string;
  @IsOptional()
  @IsNumber()
  amount: number;
}

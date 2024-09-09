import { IsNumber } from 'class-validator';

export class DepositDto {
  fullName: string;
  phone: string;
  @IsNumber()
  amount: number;
}

export class CreateWithdrawDto {
  productId: number;
  userId: number;
}

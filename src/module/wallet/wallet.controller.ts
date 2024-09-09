import { Body, Controller, Post } from '@nestjs/common';
import { CreateWithdrawDto, DepositDto } from './dto/wallet.dto';
import { WalletService } from './wallet.service';

@Controller('/wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}
  @Post('/deposit')
  deposit(@Body() depositDto: DepositDto) {
    return this.walletService.deposit(depositDto);
  }

  @Post('withdraw')
  payment(@Body() withdrawDto: CreateWithdrawDto) {
    return this.walletService.paymentByWallet(withdrawDto);
  }
}

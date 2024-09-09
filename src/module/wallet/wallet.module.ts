import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletEntity } from './entity/wallet.entity';
import { UserWalletEntity } from '../userWallet/entity/userWallet.entity';
import { userWalletService } from '../userWallet/userWallet.service';

@Module({
  imports: [TypeOrmModule.forFeature([WalletEntity, UserWalletEntity])],
  controllers: [WalletController],
  providers: [WalletService, userWalletService],
})
export class WalletModule {}

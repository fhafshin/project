import { Module } from '@nestjs/common';
import { userWalletService } from './userWallet.service';
import { userWalletController } from './userWallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserWalletEntity } from './entity/userWallet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserWalletEntity])],
  providers: [userWalletService],
  controllers: [userWalletController],
})
export class UserWalletModule {}

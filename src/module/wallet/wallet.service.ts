import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletEntity } from './entity/wallet.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateWithdrawDto, DepositDto } from './dto/wallet.dto';

import { userWalletService } from '../userWallet/userWallet.service';
import { CreateUserWalletDto } from '../userWallet/dto/userWallet.dto';
import { UserWalletEntity } from '../userWallet/entity/userWallet.entity';
import { WalletType } from './enum/wallet.enum';
import { ProductList } from './product';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletEntity)
    private walletRepository: Repository<WalletEntity>,
    private readonly userService: userWalletService,
    private dataSource: DataSource,
  ) {}

  async deposit(depositDto: DepositDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      //commit

      const { fullName, amount, phone } = depositDto;
      const user = await this.userService.createUser({
        phone,
        fullName,
      } as CreateUserWalletDto);

      const userData = await queryRunner.manager.findOneBy(UserWalletEntity, {
        id: user.id,
      });
      const newBalance = +userData.balance + amount;

      await queryRunner.manager.update(
        UserWalletEntity,
        { id: user.id },
        { balance: newBalance },
      );
      await queryRunner.manager.insert(WalletEntity, {
        amount,
        userId: userData.id,
        type: WalletType.Deposit,
        invoice_number: Date.now().toString(),
      });
      console.log(newBalance);

      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (error) {
      //roleBack
      //  console.log(error);
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
    }
    return { message: 'paymentSuccessfully' };
  }

  async paymentByWallet(withdrawDto: CreateWithdrawDto) {
    const { productId, userId } = withdrawDto;
    const product = ProductList.find((product) => product.id === productId);
    if (!product) throw new NotFoundException();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager.findOneBy(UserWalletEntity, {
        id: userId,
      });
      if (!user) throw new NotFoundException();
      if (product.price > user.balance) {
        throw new BadRequestException('user balance not enough');
      }
      const newBalance = user.balance - product.price;
      queryRunner.manager.update(
        UserWalletEntity,
        { id: userId },
        { balance: newBalance },
      );

      await queryRunner.manager.insert(WalletEntity, {
        type: WalletType.Withdraw,
        amount: product.price,
        invoice_number: Date.now().toString(),
        userId: userId,
        reason: `buy product ${product.name}`,
      });

      await queryRunner.commitTransaction();
      queryRunner.release();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      queryRunner.release();
      if (error?.statusCode) {
        throw new HttpException(error.message, error?.statusCode);
      }
      throw new BadRequestException(error?.message);
    }
    return { message: 'successfully payment' };
  }
}

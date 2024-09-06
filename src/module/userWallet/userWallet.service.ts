import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserWalletEntity } from './entity/userWallet.entity';
import { Repository } from 'typeorm';
import { CreateUserWalletDto } from './dto/userWallet.dto';

@Injectable()
export class userWalletService {
  constructor(
    @InjectRepository(UserWalletEntity)
    private userWalletRepository: Repository<UserWalletEntity>,
  ) {}
  async findById(id: number) {
    const user = await this.userWalletRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
  async createUser(userDto: CreateUserWalletDto) {
    const { fullName, phone, amount } = userDto;
    let user = await this.userWalletRepository.findOneBy({ phone });
    if (!user) {
      user = this.userWalletRepository.create({
        fullName,
        phone,
        balance: amount,
      });
      return this.userWalletRepository.save(user);
    }

    return user;
  }
}

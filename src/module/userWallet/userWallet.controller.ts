import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { userWalletService } from './userWallet.service';
import { CreateUserWalletDto } from './dto/userWallet.dto';

@Controller('/userWallet')
export class userWalletController {
  constructor(private readonly userWalletService: userWalletService) {}

  @Get('/:id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.userWalletService.findById(+id);
  }

  @Post('/')
  create(@Body() data: CreateUserWalletDto) {
    return this.userWalletService.createUser(data);
  }
}

import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from './dto/profile.entity';
import { UserEntity } from './dto/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ProfileEntity])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

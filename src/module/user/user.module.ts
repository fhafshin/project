import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { ProfileEntity } from './entity/profile.entity';
import { AuthModule } from '../auth/auth.module';
import { OtpEntity } from './entity/otp.entity';
import { FollowEntity } from './entity/follow.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FollowEntity,
      UserEntity,
      ProfileEntity,
      OtpEntity,
    ]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

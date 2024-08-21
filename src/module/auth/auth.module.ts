import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { ProfileEntity } from '../user/entity/profile.entity';
import { OtpEntity } from '../user/entity/otp.entity';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './tokens.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ProfileEntity, OtpEntity])],
  controllers: [AuthController],
  providers: [AuthService, JwtService, TokenService],
  exports: [TypeOrmModule, AuthService, TokenService, JwtService],
})
export class AuthModule {}

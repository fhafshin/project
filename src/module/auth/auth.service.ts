import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuthDto } from './dto/auth.dto';
import { AuthMethod } from './enums/method.enum';
import { AuthType } from './enums/type.enum';
import { isEmail, isPhoneNumber } from 'class-validator';
import {
  AuthMessage,
  BadRequestMessage,
  PublicMessage,
} from 'src/common/enums/message.enum';
import { ProfileEntity } from '../user/entity/profile.entity';
import { UserEntity } from '../user/entity/user.entity';
import { OtpEntity } from '../user/entity/otp.entity';
import { randomInt } from 'crypto';
import { TokenService } from './tokens.service';
import { Request, Response } from 'express';
import { AuthResponse } from './types/response';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { REQUEST } from '@nestjs/core';
import { CookiesOptionsToken } from 'src/common/utils/cookiesOptionsToken';
@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(OtpEntity)
    private otpRepository: Repository<OtpEntity>,
    private tokenService: TokenService,
    @Inject(REQUEST) private req: Request,
  ) {}

  async userExistence(data: AuthDto, res: Response) {
    const { method, type, username } = data;
    let result;
    switch (type) {
      case AuthType.Login:
        result = await this.login(method, username);
        this.sendResponse(res, result);

      case AuthType.Register:
        result = await this.register(method, username);
        this.sendResponse(res, result);
      default:
        throw new UnauthorizedException();
    }
  }

  async sendResponse(res: Response, result: AuthResponse) {
    const { token, code } = result;
    res.cookie(CookieKeys.OTP, token, CookiesOptionsToken());
    res.json({ message: PublicMessage.sendOtp, code });
  }

  private async login(method: AuthMethod, username: string) {
    const validUsername = this.usernameValidator(method, username);
    const user = await this.findUserByMethod(
      method,
      validUsername,
      BadRequestMessage.InvalidLoginData,
    );

    if (!user) throw new UnauthorizedException(AuthMessage.NotFoundMessage);

    const otp = await this.sendAndSaveOtp(user.id, method);

    const token = this.tokenService.createOtpToken({ userId: user.id });
    return { code: otp.code, token };
  }
  private async register(method: AuthMethod, username: string) {
    const validUsername = this.usernameValidator(method, username);
    console.log(username);
    let user = await this.findUserByMethod(
      method,
      validUsername,
      BadRequestMessage.InvalidRegisterData,
    );

    if (user) throw new ConflictException(AuthMessage.AlReadyExistAccount);
    if (method === 'username')
      throw new BadRequestException(BadRequestMessage.InvalidRegisterData);

    user = this.userRepository.create({ [method]: username });
    user = await this.userRepository.save(user);
    user.username = `M_${user.id}`;
    await this.userRepository.save(user);
    const otp = await this.sendAndSaveOtp(user.id, method);

    const token = this.tokenService.createOtpToken({ userId: user.id });

    return {
      token,
      code: otp.code,
    };
  }

  async checkOtp(code: string) {
    const token = this.req.cookies?.[CookieKeys.OTP];
    if (!token) throw new UnauthorizedException(AuthMessage.ExpiredCode);
    const { userId } = this.tokenService.verifyOtpToken(token);

    const otp = await this.otpRepository.findOneBy({ userId });
    if (!otp) throw new UnauthorizedException(AuthMessage.TryAgain);

    if (otp.expiresIn < new Date()) {
      throw new UnauthorizedException(AuthMessage.ExpiredCode);
    }
    if (otp.code !== code)
      throw new UnauthorizedException(AuthMessage.LoginAgain);

    const accessToken = this.tokenService.createAccessToken({
      userId: otp.userId,
    });

    if (otp.method === AuthMethod.Email) {
      await this.userRepository.update({ id: userId }, { verify_email: true });
    } else if (otp.method === AuthMethod.Phone) {
      await this.userRepository.update({ id: userId }, { verify_phone: true });
    }

    return {
      message: PublicMessage.LoggedIn,
      accessToken,
    };
  }

  async sendAndSaveOtp(userId: number, method: AuthMethod) {
    const code = randomInt(10000, 99999).toString();
    const expiresIn = new Date(Date.now() + 60 * 1000 * 2);

    let otp = await this.otpRepository.findOneBy({ userId });
    if (!otp) {
      otp = this.otpRepository.create({ code, expiresIn, userId, method });
    } else {
      if (otp.expiresIn > new Date())
        throw new BadRequestException(AuthMessage.OtpNotExpires);
      otp.code = code;
      otp.expiresIn = expiresIn;
      otp.method = method;
    }
    otp = await this.otpRepository.save(otp);
    return otp;
  }
  private async findUserByMethod(
    method: AuthMethod,
    validUsername: string,
    message: BadRequestMessage,
  ) {
    let user: UserEntity;
    if (method === AuthMethod.Phone) {
      user = await this.userRepository.findOneBy({
        phone: validUsername,
      });
    } else if (method === AuthMethod.Email) {
      user = await this.userRepository.findOneBy({ email: validUsername });
    } else if (method === AuthMethod.Username) {
      user = await this.userRepository.findOneBy({ username: validUsername });
    } else {
      throw new BadRequestException(message);
    }

    return user;
  }

  async validateAccessToken(token: string) {
    const { userId } = this.tokenService.verifyAccessToken(token);
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new UnauthorizedException(AuthMessage.LoginAgain);

    return user;
  }
  private usernameValidator(method: AuthMethod, username: string) {
    switch (method) {
      case AuthMethod.Email:
        if (isEmail(username)) return username;
        throw new BadRequestException('email is incorrect');

      case AuthMethod.Phone:
        if (isPhoneNumber(username, 'IR')) return username;
        throw new BadRequestException('phone is incorrect');
      case AuthMethod.Username:
        return username;

      default:
        throw new UnauthorizedException('username not valid');
    }
  }
}

import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuthDto } from './dto/auth.dto';
import { AuthMethod } from './enums/method.enum';
import { AuthType } from './enums/type.enum';
import { isEmail, isPhoneNumber } from 'class-validator';
import { AuthMessage, BadRequestMessage } from 'src/common/enums/message.enum';
import { ProfileEntity } from '../user/entity/profile.entity';
import { UserEntity } from '../user/entity/user.entity';
import { OtpEntity } from '../user/entity/otp.entity';
import { randomInt } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(OtpEntity)
    private otpRepository: Repository<OtpEntity>,
  ) {}

  userExistence(data: AuthDto) {
    const { method, type, username } = data;

    switch (type) {
      case AuthType.Login:
        return this.login(method, username);

      case AuthType.Register:
        return this.register(method, username);

      default:
        throw new UnauthorizedException();
    }
  }

  private async login(method: AuthMethod, username: string) {
    const validUsername = this.usernameValidator(method, username);
    const user = await this.findUserByMethod(
      method,
      validUsername,
      BadRequestMessage.InvalidLoginData,
    );

    if (!user) throw new UnauthorizedException(AuthMessage.NotFoundMessage);

    const otp = await this.sendAndSaveOtp(user.id);
    return { code: otp.code };
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

    user = this.userRepository.create({ [method]: username });
    user = await this.userRepository.save(user);
    const otp = await this.sendAndSaveOtp(user.id);
    return {
      code: otp.code,
    };
  }

  private async checkOtp() {}

  private async sendAndSaveOtp(userId: number) {
    const code = randomInt(10000, 99999).toString();
    const expiresIn = new Date(Date.now() + 60 * 1000 * 2);

    let otp = await this.otpRepository.findOneBy({ userId });
    if (!otp) {
      otp = this.otpRepository.create({ code, expiresIn, userId });
    } else {
      if (otp.expiresIn > new Date())
        throw new BadRequestException(AuthMessage.OtpNotExpires);
      otp.code = code;
      otp.expiresIn = expiresIn;
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

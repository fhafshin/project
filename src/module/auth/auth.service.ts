import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/dto/user.entity';
import { Repository } from 'typeorm';
import { ProfileEntity } from '../user/dto/profile.entity';
import { AuthDto } from './dto/auth.dto';
import { AuthMethod } from './enums/method.enum';
import { AuthType } from './enums/type.enum';
import { isEmail, isPhoneNumber } from 'class-validator';
import { AuthMessage, BadRequestMessage } from 'src/common/enums/message.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
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
    const user = this.findUserByMethod(
      method,
      validUsername,
      BadRequestMessage.InvalidLoginData,
    );

    if (!user) throw new UnauthorizedException(AuthMessage.NotFoundMessage);
  }
  private async register(method: AuthMethod, username: string) {
    const validUsername = this.usernameValidator(method, username);
    const user = this.findUserByMethod(
      method,
      validUsername,
      BadRequestMessage.InvalidRegisterData,
    );

    if (user) throw new ConflictException(AuthMessage.AlReadyExistAccount);
  }

  private async checkOtp() {}
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
        if (isPhoneNumber(username)) return username;
        throw new BadRequestException('phone is incorrect');
      case AuthMethod.Username:
        return username;

      default:
        throw new UnauthorizedException('username not valid');
    }
  }
}

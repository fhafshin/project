import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { ProfileDto } from './dto/create-profile-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from './entity/profile.entity';
import { Not, Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { Request, Response } from 'express';
import { REQUEST } from '@nestjs/core';
import { isDate, NotEquals } from 'class-validator';
import { Gender } from './enums/gender.enum';
import { ProfileImages } from './types/file';
import {
  AuthMessage,
  BadRequestMessage,
  ConflictMessage,
  NotFoundMessage,
} from 'src/common/enums/message.enum';
import { AuthService } from '../auth/auth.service';
import { TokenService } from '../auth/tokens.service';
import { OtpEntity } from './entity/otp.entity';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { AuthMethod } from '../auth/enums/method.enum';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(OtpEntity)
    private otpRepository: Repository<OtpEntity>,
    @Inject(REQUEST) private request: Request,
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  async changeProfile(files: ProfileImages, data: ProfileDto) {
    const { image_profile: imageProfile, bg_image: bgImage } = files;
    if (imageProfile?.length > 0) {
      const [image] = imageProfile;
      data.image_profile = image.path;
    }
    if (bgImage?.length > 0) {
      const [image] = bgImage;
      data.bg_image = image.path;
    }
    const { id: userId } = this.request.user;
    const {
      nik_name,
      bio,
      birthday,
      x_profile,
      linkedin_profile,
      gender,
      image_profile,
      bg_image,
    } = data;
    let profile = await this.profileRepository.findOneBy({ userId });
    if (profile) {
      if (nik_name) profile.nik_name = nik_name;
      if (bio) profile.bio = bio;
      if (birthday && isDate(new Date(birthday))) profile.birthday = birthday;
      if (gender && Object.values(Gender).includes(gender))
        profile.gender = gender;
      if (linkedin_profile) profile.linkedin_profile = linkedin_profile;
      if (x_profile) profile.x_profile = x_profile;
      if (image_profile) profile.image_profile = image_profile;
      if (bg_image) profile.bg_image = bg_image;
    } else {
      profile = this.profileRepository.create({
        nik_name,
        bio,
        birthday,
        x_profile,
        linkedin_profile,
        gender,
        userId,
        bg_image,
        image_profile,
      });
    }

    await this.profileRepository.save(profile);
  }

  profile() {
    const { id } = this.request.user;
    return this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
  }

  async changeEmail(email: string) {
    const { id } = this.request.user;
    console.log(email);
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    if (user && user.id !== id)
      throw new ConflictException(ConflictMessage.Email);
    else if (user && user.id === id) return { message: 'updated' };
    user.new_email = email;
    const otp = await this.authService.sendAndSaveOtp(id, AuthMethod.Email);
    const token = this.tokenService.createEmailToken({ email });
    return {
      code: otp.code,
      token,
    };
  }
  async verifyEmail(code: string) {
    const { id: userId, new_email } = this.request.user;

    const token = this.request.cookies?.[CookieKeys.EmailOTP];
    if (!token) throw new UnauthorizedException(AuthMessage.ExpiredCode);
    const { email } = this.tokenService.verifyEmailToken(token);

    const otp = await this.checkOtp(userId, code);
    if (email !== new_email)
      throw new BadRequestException(BadRequestMessage.invalidEmail);

    if (otp.method !== AuthMethod.Email)
      throw new BadRequestException(BadRequestMessage.someThingWrong);
  }

  async checkOtp(userId: number, code: string) {
    const otp = await this.otpRepository.findOneBy({ userId });
    if (!otp) throw new BadRequestException(NotFoundMessage.NotFound);
    const date = new Date();
    if (otp.expiresIn < date)
      throw new BadRequestException(AuthMessage.ExpiredCode);
    if (otp.code !== code) throw new BadRequestException(AuthMessage.TryAgain);

    return otp;
  }
}

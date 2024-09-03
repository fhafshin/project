import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { ProfileDto } from './dto/create-profile-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from './entity/profile.entity';
import { IsNull, Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { isDate } from 'class-validator';
import { Gender } from './enums/gender.enum';
import { ProfileImages } from './types/file';
import {
  AuthMessage,
  BadRequestMessage,
  ConflictMessage,
  NotFoundMessage,
  PublicMessage,
} from 'src/common/enums/message.enum';
import { AuthService } from '../auth/auth.service';
import { TokenService } from '../auth/tokens.service';
import { OtpEntity } from './entity/otp.entity';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { AuthMethod } from '../auth/enums/method.enum';
import { FollowEntity } from './entity/follow.entity';
import { EntityNames } from 'src/common/enums/entity.enum';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  PaginationGenerator,
  PaginationSolver,
} from 'src/common/utils/pagination.util';
import { UserBlockDto } from '../auth/dto/auth.dto';
import { UserStatus } from 'src/common/enums/status.enum';
import { isNull } from 'util';

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
    @InjectRepository(FollowEntity)
    private followRepository: Repository<FollowEntity>,
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
    return this.userRepository
      .createQueryBuilder(EntityNames.User)
      .where({ id })
      .leftJoin('user.profile', 'profile')
      .addSelect('profile.nik_name')
      .loadRelationCountAndMap('user.followers', 'user.followers')
      .loadRelationCountAndMap('user.followings', 'user.followings')
      .getOne();
  }

  async changeEmail(email: string) {
    const { id } = this.request.user;
    console.log(email);
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (user && user.id !== id)
      throw new ConflictException(ConflictMessage.Email);
    else if (user && user.id === id) return { message: 'updated' };
    await this.userRepository.update({ id }, { new_email: email });
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

    await this.userRepository.update(
      { id: userId },
      { email, verify_email: true, new_email: null },
    );

    return { message: PublicMessage.Created };
  }
  async changePhone(phone: string) {
    const { id } = this.request.user;
    console.log(phone);
    const user = await this.userRepository.findOne({
      where: { phone },
    });

    if (user && user.id !== id)
      throw new ConflictException(ConflictMessage.Phone);
    else if (user && user.id === id) return { message: 'updated' };
    await this.userRepository.update({ id }, { new_phone: phone });
    const otp = await this.authService.sendAndSaveOtp(id, AuthMethod.Phone);
    const token = this.tokenService.createPhoneToken({ phone });
    return {
      code: otp.code,
      token,
    };
  }
  async verifyPhone(code: string) {
    const { id: userId, new_phone } = this.request.user;

    const token = this.request.cookies?.[CookieKeys.PhoneOTP];
    if (!token) throw new UnauthorizedException(AuthMessage.ExpiredCode);
    const { phone } = this.tokenService.verifyPhoneToken(token);

    const otp = await this.checkOtp(userId, code);
    if (phone !== new_phone)
      throw new BadRequestException(BadRequestMessage.someThingWrong);

    if (otp.method !== AuthMethod.Phone)
      throw new BadRequestException(BadRequestMessage.someThingWrong);

    await this.userRepository.update(
      { id: userId },
      { phone, verify_phone: true, new_phone: null },
    );

    return { message: PublicMessage.Created };
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

  async changeUsername(username: string) {
    const { id } = this.request.user;
    const user = await this.userRepository.findOneBy({ username });
    if (user && user.id !== id)
      throw new ConflictException(ConflictMessage.Username);
    else if (user && user.id === id) return { message: PublicMessage.Updated };
    await this.userRepository.update({ id }, { username });
    return {
      message: PublicMessage.Updated,
    };
  }

  async checkLogin() {
    const id = this.request?.user?.id;
    if (!id) throw new UnauthorizedException(AuthMessage.LoginAgain);
    else return this.request.user;
  }

  async followToggle(followingId: number) {
    const { id: userId } = this.request.user;
    const following = await this.userRepository.findOneBy({ id: followingId });
    if (!following) throw new NotFoundException(NotFoundMessage.NotFoundUser);
    const isFollowing = await this.followRepository.findOneBy({
      followingId,
      followerId: userId,
    });
    let message = PublicMessage.Follow;
    if (isFollowing) {
      await this.followRepository.remove(isFollowing);
      message = PublicMessage.UnFollow;
    } else {
      await this.followRepository.insert({ followingId, followerId: userId });
    }

    return {
      message,
    };
  }

  async following(paginationDto: PaginationDto) {
    const { limit, page, skip } = PaginationSolver(paginationDto);
    const { id: userId } = this.request.user;
    const [following, count] = await this.followRepository.findAndCount({
      where: { followerId: userId },
      relations: { following: { profile: true } },
      select: {
        following: { id: true, profile: { id: true, nik_name: true } },
      },
      skip,
      take: limit,
    });
    return { pagination: PaginationGenerator(count, page, limit), following };
  }

  async followers(paginationDto: PaginationDto) {
    const { id: userId } = this.request.user;

    const { limit, page, skip } = PaginationSolver(paginationDto);
    const [followers, count] = await this.followRepository.findAndCount({
      where: { followingId: userId },
      relations: { follower: { profile: true } },
      select: {
        follower: { id: true, profile: { id: true, nik_name: true } },
      },

      skip,
      take: limit,
    });
    return { pagination: PaginationGenerator(count, page, limit), followers };
  }

  async blockToggle(userBlockDto: UserBlockDto) {
    const { userId } = userBlockDto;
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException(NotFoundMessage.NotFoundUser);
    let message = PublicMessage.Blocked;

    if (user?.status == UserStatus.Block) {
      message = PublicMessage.UnBlocked;
      await this.userRepository.update({ id: userId }, { status: null });
    } else {
      await this.userRepository.update(
        { id: userId },
        { status: UserStatus.Block },
      );
    }

    return { message };
  }
}

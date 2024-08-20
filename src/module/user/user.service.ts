import { Inject, Injectable, Scope } from '@nestjs/common';
import { ProfileDto } from './dto/create-profile-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from './entity/profile.entity';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { isDate } from 'class-validator';
import { Gender } from './enums/gender.enum';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @Inject(REQUEST) private request: Request,
  ) {}

  async changeProfile(data: ProfileDto) {
    const { id: userId } = this.request.user;
    const { nik_name, bio, birthday, x_profile, linkedin_profile, gender } =
      data;
    let profile = await this.profileRepository.findOneBy({ userId });
    if (profile) {
      if (nik_name) profile.nik_name = nik_name;
      if (bio) profile.bio = bio;
      if (birthday && isDate(new Date(birthday))) profile.birthday = birthday;
      if (gender && Object.values(Gender).includes(gender))
        profile.gender = gender;
      if (linkedin_profile) profile.linkedin_profile = linkedin_profile;
      if (x_profile) profile.x_profile = x_profile;
    } else {
      profile = this.profileRepository.create({
        nik_name,
        bio,
        birthday,
        x_profile,
        linkedin_profile,
        gender,
        userId,
      });
    }

    await this.profileRepository.save(profile);
  }
}

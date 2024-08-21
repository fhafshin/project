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
import { ProfileImages } from './types/file';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @Inject(REQUEST) private request: Request,
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
}

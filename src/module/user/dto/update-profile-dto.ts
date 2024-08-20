import { PartialType } from '@nestjs/swagger';
import { ProfileDto } from './create-profile-dto';

export class UpdateProfileDto extends PartialType(ProfileDto) {}

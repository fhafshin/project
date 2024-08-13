import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityNames } from 'src/common/enums/entity.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
@Entity(EntityNames.Profile)
export class ProfileEntity extends BaseEntity {
  @Column()
  nik_name: string;
  @Column({ nullable: true })
  bio: string;
  @Column({ nullable: true })
  image_profile: string;
  @Column({ nullable: true })
  bg_image: string;
  @Column({ nullable: true })
  gender: string;
  @Column({ nullable: true })
  birthday: Date;

  @Column({ nullable: true })
  linkedin_profile: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  userId: number;

  @OneToOne(() => UserEntity, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}

import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityNames } from 'src/common/enums/entity.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import { ProfileEntity } from './profile.entity';
import { OtpEntity } from './otp.entity';
import { BlogEntity } from 'src/module/blog/entity/blog.entity';
import { BlogLikesEntity } from 'src/module/blog/entity/like.entity';
import { BookmarkEntity } from 'src/module/blog/entity/bookmark.entity';

@Entity(EntityNames.User)
export class UserEntity extends BaseEntity {
  @Column({ unique: true, nullable: true })
  username: string;
  @Column({ unique: true, nullable: true })
  phone: string;
  @Column({ unique: true, nullable: true })
  email: string;
  @Column({ nullable: true })
  password: string;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
  @Column({ nullable: true })
  new_phone: string;

  @Column({ nullable: true })
  new_email: string;
  @Column({ nullable: true, default: false })
  verify_email: boolean;
  @Column({ nullable: true, default: false })
  verify_phone: boolean;
  @OneToOne(() => ProfileEntity, (profile) => profile.user, { nullable: true })
  profile: ProfileEntity;

  @OneToOne(() => OtpEntity, (otp) => otp.user)
  otp: OtpEntity;

  @OneToMany(() => BlogEntity, (blog) => blog.author)
  blogs: BlogEntity[];

  @OneToMany(() => BlogLikesEntity, (likes) => likes.user)
  blog_likes: BlogLikesEntity[];

  @OneToMany(() => BookmarkEntity, (bookmark) => bookmark.user)
  blog_bookmarks: BookmarkEntity[];
}

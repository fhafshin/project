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
import { BlogCommentEntity } from 'src/module/blog/entity/comment.entity';
import { BlogBookmarkEntity } from 'src/module/blog/entity/bookmark.entity';
import { ImageEntity } from 'src/module/image/entity/image.entity';
import { Roles } from 'src/common/enums/role.enum';
import { FollowEntity } from './follow.entity';
import { UserService } from '../user.service';
import { UserStatus } from 'src/common/enums/status.enum';

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
  status: UserStatus;

  @Column({ nullable: true })
  new_email: string;
  @Column({ nullable: true, default: false })
  verify_email: boolean;
  @Column({ nullable: true, default: false })
  verify_phone: boolean;
  @OneToOne(() => ProfileEntity, (profile) => profile.user, { nullable: true })
  profile: ProfileEntity;
  @Column({ default: Roles.User })
  role: string;
  @OneToOne(() => OtpEntity, (otp) => otp.user)
  otp: OtpEntity;

  @OneToMany(() => BlogEntity, (blog) => blog.author)
  blogs: BlogEntity[];

  @OneToMany(() => BlogLikesEntity, (likes) => likes.user)
  blog_likes: BlogLikesEntity[];

  @OneToMany(() => BlogBookmarkEntity, (bookmark) => bookmark.user)
  blog_bookmarks: BlogBookmarkEntity[];

  @OneToMany(() => BlogCommentEntity, (comment) => comment.user)
  blog_comments: BlogCommentEntity[];

  @OneToMany(() => ImageEntity, (images) => images.user)
  images: ImageEntity[];

  @OneToMany(() => FollowEntity, (follow) => follow.following)
  followers: FollowEntity[];
  @OneToMany(() => FollowEntity, (follow) => follow.follower)
  followings: FollowEntity[];
}

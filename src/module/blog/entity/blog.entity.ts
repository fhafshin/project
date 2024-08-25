import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityNames } from 'src/common/enums/entity.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { BlogStatus } from '../enum/status.enum';
import { UserEntity } from 'src/module/user/entity/user.entity';
import { BlogLikesEntity } from './like.entity';
import { BookmarkEntity } from './bookmark.entity';
@Entity(EntityNames.Blog)
export class BlogEntity extends BaseEntity {
  @Column()
  @ApiProperty()
  title: string;
  @Column()
  @ApiProperty()
  description: string;
  @Column()
  @ApiProperty()
  content: string;
  @ApiProperty()
  @Column({ nullable: true })
  image: string;
  @ApiProperty()
  @Column({ default: BlogStatus.Draft })
  @ApiProperty({ enum: BlogStatus, default: BlogStatus.Draft })
  status: BlogStatus;
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  authorId: number;
  @ManyToOne(() => UserEntity, (user) => user.blogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authorId' })
  author: UserEntity;

  @OneToMany(() => BlogLikesEntity, (blog_likes) => blog_likes.blog)
  likes: BlogLikesEntity[];

  @OneToMany(() => BookmarkEntity, (bookmark) => bookmark.blog)
  bookmarks: BookmarkEntity[];
}

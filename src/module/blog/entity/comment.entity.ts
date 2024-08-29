import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityNames } from 'src/common/enums/entity.enum';
import { UserEntity } from 'src/module/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BlogEntity } from './blog.entity';
@Entity(EntityNames.BlogComments)
export class BlogCommentEntity extends BaseEntity {
  @Column()
  text: string;
  @Column({ default: true })
  accepted: boolean;
  @Column()
  blogId: number;
  @Column({ nullable: true })
  parentId: number;
  @Column()
  userId: number;
  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.blog_comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => BlogEntity, (blog) => blog.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blogId' })
  blog: BlogEntity;

  @ManyToOne(() => BlogCommentEntity, (parent) => parent.children, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parentId' })
  parent: BlogCommentEntity;

  @OneToMany(() => BlogCommentEntity, (comment) => comment.parent)
  children: BlogCommentEntity[];
}

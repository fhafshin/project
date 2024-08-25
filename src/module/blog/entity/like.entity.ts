import { EntityNames } from 'src/common/enums/entity.enum';
import { UserEntity } from 'src/module/user/entity/user.entity';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BlogEntity } from './blog.entity';

@Entity(EntityNames.BlogLikes)
export class BlogLikesEntity extends BaseEntity {
  @Column()
  blogId: number;
  @Column()
  userId: number;
  @ManyToOne(() => BlogEntity, (blog) => blog.likes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'blogId' })
  blog: BlogEntity;
  @ManyToOne(() => UserEntity, (user) => user.blog_likes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}

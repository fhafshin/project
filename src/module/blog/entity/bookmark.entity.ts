import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityNames } from 'src/common/enums/entity.enum';
import { UserEntity } from 'src/module/user/entity/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BlogEntity } from './blog.entity';

@Entity(EntityNames.BlogBookmarks)
export class BookmarkEntity extends BaseEntity {
  @Column()
  blogId: number;

  @Column()
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.blog_bookmarks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => BlogEntity, (blog) => blog.bookmarks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'blogId' })
  blog: BlogEntity;
}

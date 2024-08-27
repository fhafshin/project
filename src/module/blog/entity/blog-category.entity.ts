import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityNames } from 'src/common/enums/entity.enum';
import { CategoryEntity } from 'src/module/category/entity/category.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BlogEntity } from './blog.entity';
@Entity(EntityNames.BlogCategory)
export class BlogCategoryEntity extends BaseEntity {
  @Column()
  blogId: number;
  @Column()
  categoryId: number;
  @ManyToOne(() => CategoryEntity, (category) => category.blog_categories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;

  //   @ManyToOne(() => UserEntity, (user) => user.blog_categories)
  //   @JoinColumn({ name: 'userId' })
  //   user: UserEntity;

  @ManyToOne(() => BlogEntity, (blog) => blog.categories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'blogId' })
  blog: BlogEntity;
}

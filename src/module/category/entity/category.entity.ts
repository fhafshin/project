import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityNames } from 'src/common/enums/entity.enum';
import { BlogCategoryEntity } from 'src/module/blog/entity/blog-category.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity(EntityNames.Category)
export class CategoryEntity extends BaseEntity {
  @Column()
  title: string;
  @Column({ nullable: true })
  priority: number;

  @OneToMany(
    () => BlogCategoryEntity,
    (blog_category) => blog_category.category,
  )
  blog_categories: BlogCategoryEntity[];
}

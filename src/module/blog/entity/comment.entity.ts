import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityNames } from 'src/common/enums/entity.enum';
import { Column, CreateDateColumn, Entity } from 'typeorm';
@Entity(EntityNames.BlogComments)
export class BlogCommentEntity extends BaseEntity {
  @Column()
  text: string;
  @Column({ default: true })
  accepted: boolean;
  @Column()
  blogId: number;
  @Column()
  parentId: number;
  @Column()
  userId: number;
  @CreateDateColumn()
  created_at: Date;
}

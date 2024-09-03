import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityNames } from 'src/common/enums/entity.enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
@Entity(EntityNames.Follow)
export class FollowEntity extends BaseEntity {
  @Column()
  followingId: number;
  @Column()
  followerId: number;

  @ManyToOne(() => UserEntity, (user) => user.followings)
  @JoinColumn({ name: 'followerId' })
  follower: UserEntity;
  @ManyToOne(() => UserEntity, (user) => user.followers)
  @JoinColumn({ name: 'followingId' })
  following: UserEntity;
}

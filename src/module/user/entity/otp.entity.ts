import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityNames } from 'src/common/enums/entity.enum';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity(EntityNames.Otp)
export class OtpEntity extends BaseEntity {
  @Column()
  code: string;

  @Column()
  expiresIn: Date;
  @Column()
  userId: number;

  @OneToOne(() => UserEntity, (user) => user.otp, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;
}

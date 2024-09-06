import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WalletType } from '../enum/wallet.enum';
import { UserWalletEntity } from 'src/module/userWallet/entity/userWallet.entity';

@Entity('wallet')
export class WalletEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @CreateDateColumn()
  created_at: Date;
  @Column({ type: 'enum', enum: WalletType })
  type: WalletType;
  @Column()
  invoice_number: string;
  @Column()
  userId: number;
  @ManyToOne(() => UserWalletEntity, (user) => user.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserWalletEntity;
}

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
  type: string;
  @Column({ type: 'numeric' })
  amount: number;
  @Column()
  invoice_number: string;
  @Column()
  userId: number;
  @Column({ nullable: true })
  reason: string;
  @ManyToOne(() => UserWalletEntity, (user) => user.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserWalletEntity;
}

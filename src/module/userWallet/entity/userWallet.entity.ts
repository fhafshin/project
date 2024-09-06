import { WalletEntity } from 'src/module/wallet/entity/wallet.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('userWallet')
export class UserWalletEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  fullName: string;
  @Column()
  phone: string;
  @Column({ type: 'numeric', default: 0 })
  balance: number;
  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => WalletEntity, (wallet) => wallet.user)
  transactions: WalletEntity[];
}

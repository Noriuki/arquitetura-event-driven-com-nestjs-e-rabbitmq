import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type PaymentOutcome = 'COMPLETED' | 'FAILED';

@Entity('payment_records')
export class PaymentRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  orderId: string;

  @Column({ type: 'varchar', length: 16 })
  status: PaymentOutcome;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}

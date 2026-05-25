import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderStatus } from '../enums/order-status.enum';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 32 })
  status: OrderStatus;

  @Column({ type: 'uuid' })
  customerId: string;

  @Column({ type: 'simple-json' })
  payload: Record<string, unknown>;

  @CreateDateColumn()
  createdAt: Date;
}

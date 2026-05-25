import { OrderEntity } from '../../domain/entities/order.entity';
import { OrderStatus } from '../../domain/enums/order-status.enum';
import { CreateOrderCommand } from '../commands/create-order.command';

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');

export interface OrderRepository {
  findAll(): Promise<OrderEntity[]>;
  findById(id: string): Promise<OrderEntity | null>;
  createPending(command: CreateOrderCommand): Promise<OrderEntity>;
  transitionFromPending(id: string, next: OrderStatus): Promise<number>;
}

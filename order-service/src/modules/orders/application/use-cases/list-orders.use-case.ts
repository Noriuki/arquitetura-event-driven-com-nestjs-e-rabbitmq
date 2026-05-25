import { Inject, Injectable } from '@nestjs/common';
import { OrderEntity } from '../../domain/entities/order.entity';
import { ORDER_REPOSITORY } from '../ports/order.repository.port';
import type { OrderRepository } from '../ports/order.repository.port';

@Injectable()
export class ListOrdersUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orders: OrderRepository,
  ) {}

  execute(): Promise<OrderEntity[]> {
    return this.orders.findAll();
  }
}

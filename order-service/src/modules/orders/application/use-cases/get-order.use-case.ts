import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OrderEntity } from '../../domain/entities/order.entity';
import { ORDER_REPOSITORY } from '../ports/order.repository.port';
import type { OrderRepository } from '../ports/order.repository.port';

@Injectable()
export class GetOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orders: OrderRepository,
  ) {}

  async execute(id: string): Promise<OrderEntity> {
    const order = await this.orders.findById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }
}

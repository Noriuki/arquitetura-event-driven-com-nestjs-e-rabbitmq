import { Inject, Injectable, Logger } from '@nestjs/common';
import { OrderEntity } from '../../domain/entities/order.entity';
import { CreateOrderCommand } from '../commands/create-order.command';
import { ORDER_EVENTS_PUBLISHER } from '../ports/order-events.publisher.port';
import type { OrderEventsPublisher } from '../ports/order-events.publisher.port';
import { ORDER_REPOSITORY } from '../ports/order.repository.port';
import type { OrderRepository } from '../ports/order.repository.port';

@Injectable()
export class CreateOrderUseCase {
  private readonly log = new Logger(CreateOrderUseCase.name);

  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orders: OrderRepository,
    @Inject(ORDER_EVENTS_PUBLISHER)
    private readonly events: OrderEventsPublisher,
  ) {}

  async execute(command: CreateOrderCommand): Promise<OrderEntity> {
    const order = await this.orders.createPending(command);

    try {
      this.events.publishOrderCreated({
        orderId: order.id,
        customerId: command.customerId,
        items: command.items,
        payment: command.payment,
        delivery: command.delivery,
      });
    } catch (e) {
      this.log.warn(
        `RabbitMQ publish failed (order persisted as PENDING): ${String(e)}`,
      );
    }

    return order;
  }
}

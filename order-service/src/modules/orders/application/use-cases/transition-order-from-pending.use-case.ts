import { Inject, Injectable, Logger } from '@nestjs/common';
import { OrderStatus } from '../../domain/enums/order-status.enum';
import { ORDER_REPOSITORY } from '../ports/order.repository.port';
import type { OrderRepository } from '../ports/order.repository.port';

@Injectable()
export class TransitionOrderFromPendingUseCase {
  private readonly log = new Logger(TransitionOrderFromPendingUseCase.name);

  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orders: OrderRepository,
  ) {}

  async execute(orderId: string, next: OrderStatus): Promise<void> {
    const affected = await this.orders.transitionFromPending(orderId, next);
    if (affected === 0) {
      this.log.debug(
        `No transition ${OrderStatus.PENDING} -> ${next} for ${orderId} (duplicate or stale event)`,
      );
    }
  }
}

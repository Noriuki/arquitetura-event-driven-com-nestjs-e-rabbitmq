import { Injectable } from '@nestjs/common';
import { OrderStatus } from '../../domain/enums/order-status.enum';
import { extractOrderId } from '../utils/extract-order-id';
import { TransitionOrderFromPendingUseCase } from './transition-order-from-pending.use-case';

@Injectable()
export class HandleInventoryInsufficientUseCase {
  constructor(
    private readonly transition: TransitionOrderFromPendingUseCase,
  ) {}

  async execute(data: unknown): Promise<void> {
    const orderId = extractOrderId(data);
    if (!orderId) {
      throw new Error('inventory.insufficient payload missing orderId');
    }
    await this.transition.execute(orderId, OrderStatus.INSUFFICIENT_STOCK);
  }
}

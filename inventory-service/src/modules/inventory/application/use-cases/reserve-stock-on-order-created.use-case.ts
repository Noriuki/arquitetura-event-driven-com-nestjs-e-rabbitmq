import { Inject, Injectable } from '@nestjs/common';
import { isOrderCreated } from '../../domain/types/inventory-events';
import { INVENTORY_EVENTS_PUBLISHER } from '../ports/inventory-events.publisher.port';
import type { InventoryEventsPublisher } from '../ports/inventory-events.publisher.port';
import { STOCK_REPOSITORY } from '../ports/stock.repository.port';
import type { StockRepository } from '../ports/stock.repository.port';

@Injectable()
export class ReserveStockOnOrderCreatedUseCase {
  constructor(
    @Inject(STOCK_REPOSITORY)
    private readonly stock: StockRepository,
    @Inject(INVENTORY_EVENTS_PUBLISHER)
    private readonly events: InventoryEventsPublisher,
  ) {}

  async execute(data: unknown): Promise<void> {
    if (!isOrderCreated(data)) {
      throw new Error('Invalid order.created payload');
    }

    const { orderId, items, customerId, payment, delivery } = data;

    try {
      await this.stock.reserveLines(items);
    } catch {
      this.events.publishInsufficient(orderId, 'out_of_stock');
      return;
    }

    this.events.publishReserved({
      orderId,
      customerId,
      items,
      payment,
      delivery,
    });
  }
}

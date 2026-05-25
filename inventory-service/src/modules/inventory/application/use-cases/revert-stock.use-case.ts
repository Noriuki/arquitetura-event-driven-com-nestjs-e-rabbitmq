import { Inject, Injectable, Logger } from '@nestjs/common';
import { isStockReverted } from '../../domain/types/inventory-events';
import { STOCK_REPOSITORY } from '../ports/stock.repository.port';
import type { StockRepository } from '../ports/stock.repository.port';

@Injectable()
export class RevertStockUseCase {
  private readonly log = new Logger(RevertStockUseCase.name);

  constructor(
    @Inject(STOCK_REPOSITORY)
    private readonly stock: StockRepository,
  ) {}

  async execute(data: unknown): Promise<void> {
    if (!isStockReverted(data)) {
      throw new Error('Invalid inventory.stock_reverted payload');
    }

    await this.stock.revertLines(data.items);
    this.log.log(`Stock reverted for order ${data.orderId}`);
  }
}

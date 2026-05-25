import { Inject, Injectable, Logger } from '@nestjs/common';
import { SEED_PRODUCT_IDS } from '../../domain/constants/seed-products';
import { STOCK_REPOSITORY } from '../ports/stock.repository.port';
import type { StockRepository } from '../ports/stock.repository.port';

@Injectable()
export class SeedStockUseCase {
  private readonly log = new Logger(SeedStockUseCase.name);

  constructor(
    @Inject(STOCK_REPOSITORY)
    private readonly stock: StockRepository,
  ) {}

  async execute(): Promise<void> {
    const initialQty = Number(process.env.STOCK_INITIAL_QTY ?? 100);

    for (const productId of SEED_PRODUCT_IDS) {
      const created = await this.stock.seedIfMissing(productId, initialQty);
      if (created) {
        this.log.log(`Seeded product ${productId} qty=${initialQty}`);
      }
    }
  }
}

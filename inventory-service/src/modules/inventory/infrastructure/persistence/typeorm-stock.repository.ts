import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  StockLine,
  StockRepository,
} from '../../application/ports/stock.repository.port';
import { StockItem } from '../../domain/entities/stock-item.entity';

@Injectable()
export class TypeOrmStockRepository implements StockRepository {
  constructor(private readonly dataSource: DataSource) {}

  async seedIfMissing(productId: string, quantity: number): Promise<boolean> {
    const repo = this.dataSource.getRepository(StockItem);
    const exists = await repo.exist({ where: { productId } });
    if (!exists) {
      await repo.save(repo.create({ productId, quantity }));
      return true;
    }
    return false;
  }

  async reserveLines(lines: StockLine[]): Promise<void> {
    await this.dataSource.transaction(async (em) => {
      for (const line of lines) {
        const row = await em
          .createQueryBuilder(StockItem, 's')
          .setLock('pessimistic_write')
          .where('s.productId = :id', { id: line.productId })
          .getOne();

        if (!row || row.quantity < line.quantity) {
          throw new Error('OUT_OF_STOCK');
        }

        row.quantity -= line.quantity;
        await em.save(row);
      }
    });
  }

  async revertLines(lines: StockLine[]): Promise<void> {
    await this.dataSource.transaction(async (em) => {
      for (const line of lines) {
        const row = await em.findOneBy(StockItem, {
          productId: line.productId,
        });
        if (row) {
          row.quantity += line.quantity;
          await em.save(row);
        }
      }
    });
  }
}

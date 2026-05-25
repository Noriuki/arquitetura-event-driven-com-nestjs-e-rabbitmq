import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('stock_items')
export class StockItem {
  @PrimaryColumn({ type: 'uuid' })
  productId: string;

  @Column({ type: 'int' })
  quantity: number;
}

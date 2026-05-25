export const STOCK_REPOSITORY = Symbol('STOCK_REPOSITORY');

export interface StockLine {
  productId: string;
  quantity: number;
}

export interface StockRepository {
  seedIfMissing(productId: string, quantity: number): Promise<boolean>;
  reserveLines(lines: StockLine[]): Promise<void>;
  revertLines(lines: StockLine[]): Promise<void>;
}

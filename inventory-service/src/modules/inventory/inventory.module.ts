import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { INVENTORY_EVENTS_PUBLISHER } from './application/ports/inventory-events.publisher.port';
import { STOCK_REPOSITORY } from './application/ports/stock.repository.port';
import { ReserveStockOnOrderCreatedUseCase } from './application/use-cases/reserve-stock-on-order-created.use-case';
import { RevertStockUseCase } from './application/use-cases/revert-stock.use-case';
import { SeedStockUseCase } from './application/use-cases/seed-stock.use-case';
import { StockItem } from './domain/entities/stock-item.entity';
import { RabbitMqInventoryEventsPublisher } from './infrastructure/messaging/rabbitmq-inventory-events.publisher';
import { TypeOrmStockRepository } from './infrastructure/persistence/typeorm-stock.repository';
import { InventoryEventsController } from './presentation/messaging/inventory-events.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StockItem])],
  controllers: [InventoryEventsController],
  providers: [
    SeedStockUseCase,
    ReserveStockOnOrderCreatedUseCase,
    RevertStockUseCase,
    {
      provide: STOCK_REPOSITORY,
      useClass: TypeOrmStockRepository,
    },
    {
      provide: INVENTORY_EVENTS_PUBLISHER,
      useClass: RabbitMqInventoryEventsPublisher,
    },
  ],
})
export class InventoryModule implements OnModuleInit {
  constructor(private readonly seedStock: SeedStockUseCase) {}

  onModuleInit() {
    return this.seedStock.execute();
  }
}

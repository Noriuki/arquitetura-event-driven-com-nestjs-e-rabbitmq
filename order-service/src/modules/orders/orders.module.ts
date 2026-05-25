import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MESSAGING_HEALTH } from './application/ports/messaging-health.port';
import { ORDER_EVENTS_PUBLISHER } from './application/ports/order-events.publisher.port';
import { ORDER_REPOSITORY } from './application/ports/order.repository.port';
import { CreateOrderUseCase } from './application/use-cases/create-order.use-case';
import { GetOrderUseCase } from './application/use-cases/get-order.use-case';
import { HandleInventoryInsufficientUseCase } from './application/use-cases/handle-inventory-insufficient.use-case';
import { HandlePaymentCompletedUseCase } from './application/use-cases/handle-payment-completed.use-case';
import { HandlePaymentFailedUseCase } from './application/use-cases/handle-payment-failed.use-case';
import { ListOrdersUseCase } from './application/use-cases/list-orders.use-case';
import { TransitionOrderFromPendingUseCase } from './application/use-cases/transition-order-from-pending.use-case';
import { OrderEntity } from './domain/entities/order.entity';
import { RabbitMqOrderEventsPublisher } from './infrastructure/messaging/rabbitmq-order-events.publisher';
import { TypeOrmOrderRepository } from './infrastructure/persistence/typeorm-order.repository';
import { OrdersController } from './presentation/http/orders.controller';
import { OrderEventsController } from './presentation/messaging/order-events.controller';

const useCases = [
  ListOrdersUseCase,
  GetOrderUseCase,
  CreateOrderUseCase,
  TransitionOrderFromPendingUseCase,
  HandleInventoryInsufficientUseCase,
  HandlePaymentCompletedUseCase,
  HandlePaymentFailedUseCase,
];

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity])],
  controllers: [OrdersController, OrderEventsController],
  providers: [
    ...useCases,
    {
      provide: ORDER_REPOSITORY,
      useClass: TypeOrmOrderRepository,
    },
    {
      provide: ORDER_EVENTS_PUBLISHER,
      useClass: RabbitMqOrderEventsPublisher,
    },
    {
      provide: MESSAGING_HEALTH,
      useExisting: RabbitMqOrderEventsPublisher,
    },
  ],
  exports: [ORDER_EVENTS_PUBLISHER, MESSAGING_HEALTH],
})
export class OrdersModule {}

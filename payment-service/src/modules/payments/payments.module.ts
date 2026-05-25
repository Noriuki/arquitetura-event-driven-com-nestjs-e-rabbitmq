import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PAYMENT_EVENTS_PUBLISHER } from './application/ports/payment-events.publisher.port';
import { PAYMENT_REPOSITORY } from './application/ports/payment.repository.port';
import { PaymentFailurePolicy } from './application/services/payment-failure.policy';
import { ProcessInventoryReservedUseCase } from './application/use-cases/process-inventory-reserved.use-case';
import { PaymentRecord } from './domain/entities/payment-record.entity';
import { RabbitMqPaymentEventsPublisher } from './infrastructure/messaging/rabbitmq-payment-events.publisher';
import { TypeOrmPaymentRepository } from './infrastructure/persistence/typeorm-payment.repository';
import { PaymentEventsController } from './presentation/messaging/payment-events.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentRecord])],
  controllers: [PaymentEventsController],
  providers: [
    PaymentFailurePolicy,
    ProcessInventoryReservedUseCase,
    {
      provide: PAYMENT_REPOSITORY,
      useClass: TypeOrmPaymentRepository,
    },
    {
      provide: PAYMENT_EVENTS_PUBLISHER,
      useClass: RabbitMqPaymentEventsPublisher,
    },
  ],
})
export class PaymentsModule {}

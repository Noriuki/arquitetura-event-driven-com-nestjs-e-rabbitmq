import { Module } from '@nestjs/common';
import { OrdersModule } from 'src/modules/orders/orders.module';
import { HealthController } from './health.controller';

@Module({
  imports: [OrdersModule],
  controllers: [HealthController],
})
export class HealthModule {}

import { Controller, Get, Inject, ServiceUnavailableException } from '@nestjs/common';
import { MESSAGING_HEALTH } from 'src/modules/orders/application/ports/messaging-health.port';
import type { MessagingHealth } from 'src/modules/orders/application/ports/messaging-health.port';

@Controller('health')
export class HealthController {
  constructor(
    @Inject(MESSAGING_HEALTH)
    private readonly messaging: MessagingHealth,
  ) {}

  @Get()
  live() {
    return {
      status: 'ok',
      service: 'order-service',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('ready')
  ready() {
    if (!this.messaging.isConnected()) {
      throw new ServiceUnavailableException({
        status: 'not_ready',
        rabbitmq: 'disconnected',
      });
    }

    return {
      status: 'ok',
      rabbitmq: 'connected',
    };
  }
}

import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqp, { Channel, ChannelModel } from 'amqplib';
import { PaymentEventsPublisher } from '../../application/ports/payment-events.publisher.port';

@Injectable()
export class RabbitMqPaymentEventsPublisher
  implements PaymentEventsPublisher, OnModuleInit, OnModuleDestroy
{
  private readonly log = new Logger(RabbitMqPaymentEventsPublisher.name);
  private channel: Channel | null = null;
  private connection: ChannelModel | null = null;

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    const url =
      this.config.get<string>('RABBITMQ_URL') ??
      'amqp://admin:admin@localhost:5672';
    const exchange =
      this.config.get<string>('RABBITMQ_EXCHANGE') ?? 'order_exchange';

    this.connection = await amqp.connect(url);
    this.channel = await this.connection.createChannel();
    await this.channel.assertExchange(exchange, 'topic', { durable: true });
    this.log.log(`Publisher bound to exchange ${exchange}`);
  }

  async onModuleDestroy() {
    await this.channel?.close().catch(() => undefined);
    await this.connection?.close().catch(() => undefined);
  }

  publishCompleted(orderId: string): void {
    this.publish('payment.completed', { orderId });
  }

  publishFailed(
    orderId: string,
    items: { productId: string; quantity: number }[],
    reason: string,
  ): void {
    this.publish('payment.failed', { orderId, reason });
    this.publish('inventory.stock_reverted', { orderId, items });
  }

  private publish(routingKey: string, payload: Record<string, unknown>) {
    const exchange =
      this.config.get<string>('RABBITMQ_EXCHANGE') ?? 'order_exchange';
    const body = JSON.stringify({ pattern: routingKey, data: payload });
    this.channel?.publish(exchange, routingKey, Buffer.from(body));
  }
}

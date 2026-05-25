import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqp, { Channel, ChannelModel } from 'amqplib';
import {
  OrderCreatedEventPayload,
  OrderEventsPublisher,
} from '../../application/ports/order-events.publisher.port';
import { MessagingHealth } from '../../application/ports/messaging-health.port';

@Injectable()
export class RabbitMqOrderEventsPublisher
  implements OrderEventsPublisher, MessagingHealth, OnModuleInit
{
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
    console.log('RabbitMQ connected');
  }

  isConnected(): boolean {
    return this.channel !== null && this.connection !== null;
  }

  publishOrderCreated(payload: OrderCreatedEventPayload): void {
    const exchange =
      this.config.get<string>('RABBITMQ_EXCHANGE') ?? 'order_exchange';
    this.publish(exchange, 'order.created', { ...payload });
  }

  private publish(
    exchange: string,
    routingKey: string,
    message: Record<string, unknown>,
  ) {
    const body = JSON.stringify({
      pattern: routingKey,
      data: message,
    });
    this.channel?.publish(exchange, routingKey, Buffer.from(body));
    console.log(
      `Message published to ${exchange} with routing key ${routingKey}`,
    );
  }
}

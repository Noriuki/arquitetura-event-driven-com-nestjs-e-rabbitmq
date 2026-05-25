import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL ?? 'amqp://admin:admin@localhost:5672'],
      queue:
        process.env.QUEUE ??
        process.env.QUEUE_NAME ??
        'inventory_queue',
      exchange: process.env.EXCHANGE ?? process.env.RABBITMQ_EXCHANGE ?? 'order_exchange',
      exchangeType: process.env.EXCHANGE_TYPE ?? 'topic',
      wildcards: true,
      queueOptions: {
        durable: true,
      },
      noAck: false,
    },
  });
  await app.listen();
}
bootstrap();

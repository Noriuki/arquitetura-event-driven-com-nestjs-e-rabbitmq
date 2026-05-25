import { Logger } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { Channel, Message } from 'amqplib';

export async function consumeWithAck(
  context: RmqContext,
  work: () => Promise<void>,
  log: Logger,
): Promise<void> {
  const channel = context.getChannelRef() as Channel;
  const originalMessage = context.getMessage() as Message;

  try {
    await work();
    channel.ack(originalMessage);
  } catch (err) {
    log.error(err);
    channel.nack(originalMessage, false, false);
  }
}

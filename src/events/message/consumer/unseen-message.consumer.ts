import { types } from 'cassandra-driver';
import { PhantomService } from '@core/phantoms/phantom.service';
import { PulsarService } from '@core/pulsar/pulsar.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UnseenMessageConsumer {
  constructor(
    private phantomService: PhantomService,
    private pulsarService: PulsarService,
  ) {}

  async sendUnseenMessagesToRecipient(phantom_id: types.Uuid) {
    const consumer = await this.pulsarService.client.subscribe({
      topic: `private-message-${phantom_id}`,
      subscription: phantom_id.toString(),
      subscriptionType: 'Shared',
    });

    while (true) {
      const message = await consumer.receive();

      const thePhantom = this.phantomService.phantoms.get(phantom_id);

      // If there are no more messages to consume or the phantom disconnected , break out of the loop
      if (!message || !thePhantom) break;

      thePhantom.send(message.getData().toString());

      await consumer.acknowledge(message);
    }

    await consumer.close();
  }
}

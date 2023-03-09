import { Injectable } from '@nestjs/common';
import { Client } from 'pulsar-client';

@Injectable()
export class PulsarService {
  client: Client;

  constructor() {
    this.client = new Client({
      serviceUrl: 'pulsar://localhost:6650',
    });
  }

  async publishMessage(topic: string, message: string) {
    const producer = await this.client.createProducer({
      topic,
    });

    await producer.send({
      data: Buffer.from(message),
    });

    await producer.flush();
    await producer.close();
  }
}

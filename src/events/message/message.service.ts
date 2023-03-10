import { PhantomService } from '@core/phantoms/phantom.service';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { types } from 'cassandra-driver';
import { CreateMessageDTO } from './dto/create-message.dto';
import { Message } from './message.model';
import { MessageRepository } from './message.repository';
import { PulsarService } from '@core/pulsar/pulsar.service';

@Injectable()
export class MessageService {
  constructor(
    private messageRepository: MessageRepository,
    private phantomService: PhantomService,
    private pulsarService: PulsarService,
    @Inject('NATS') private readonly NATS: ClientProxy,
  ) {}

  async getMessages() {
    return this.messageRepository.getMessages();
  }

  async broadcastMessage(message: Message) {
    const receiver_phantom = this.phantomService.phantoms.get(
      message.recipient_id,
    );

    // if other phantom is online send also message to him/her
    if (receiver_phantom) receiver_phantom.send(JSON.stringify(message));
    // if phantom is offline send message to notification queue
    else {
      await this.pulsarService.publishMessage(
        `private-message-${message.recipient_id}`,
        JSON.stringify(message),
      );
    }
  }

  async createMessage(
    createMessageDto: CreateMessageDTO,
    sender_phantom_client: any,
  ) {
    const message = {
      ...createMessageDto,
      conversation_id: types.Uuid.random(),
      id: types.Uuid.random(),
      created_at: Date.now(),
      seen: false,
    };

    try {
      await this.messageRepository.createMessage(message);

      // if other phantom is online send also message to him/her
      // check if receiver phantom is online on current node, send him message or publish over nats to find her
      const receiver_phantom = this.phantomService.phantoms.get(
        message.recipient_id,
      );

      if (receiver_phantom) receiver_phantom.send(JSON.stringify(message));
      else this.NATS.emit('send-private-message', message);

      // return back ack message to sender
      sender_phantom_client.send(JSON.stringify(message));
    } catch (e) {
      console.log(e); // should error report with Sentry
    }
  }

  async markAsReadMessage(message_id: String[]) {
    await this.messageRepository.markAsReedMessage(message_id);
  }
}

import { PhantomService } from '@core/phantoms/phantom.service';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { types } from 'cassandra-driver';
import { CreateMessageDTO } from './dto/create-message.dto';
import { Message } from './message.model';
import { MessageRepository } from './message.repository';

@Injectable()
export class MessageService {
  constructor(
    private messageRepository: MessageRepository,
    private phantomService: PhantomService,
    @Inject('NATS') private readonly NATS: ClientProxy,
  ) {}

  async getMessages() {
    return this.messageRepository.getMessages();
  }

  broadcastMessage(message: Message): void {
    const receiver_phantom = this.phantomService.phantoms.get(message.receiver);

    if (receiver_phantom) receiver_phantom.send(JSON.stringify(message));
  }

  async createMessage(createMessageDto: CreateMessageDTO) {
    const message = {
      ...createMessageDto,
      id: types.Uuid.random(),
      created_at: Date.now(),
    };

    // 1. insert to DB
    await this.messageRepository.createMessage(message);

    // 2. if other user is online send also message to him/her
    // check if receiver phantom is online on current node, send him message or publish over nats to find her
    const receiver_phantom = this.phantomService.phantoms.get(message.receiver);

    if (receiver_phantom) receiver_phantom.send(JSON.stringify(message));
    else this.NATS.emit('send-private-message', message);
  }
}

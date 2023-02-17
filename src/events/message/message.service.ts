import { Injectable } from '@nestjs/common';
import { types } from 'cassandra-driver';
import { CreateMessageDTO } from './dto/create-message.dto';
import { MessageRepository } from './message.repository';

@Injectable()
export class MessageService {
  constructor(private messageRepository: MessageRepository) {}

  async getMessages() {
    return this.messageRepository.getMessages();
  }

  async createMessage(message: CreateMessageDTO) {
    const newMessage = {
      ...message,
      id: types.Uuid.random(),
      created_at: Date.now(),
    };

    // 1. insert to DB
    await this.messageRepository.createMessage(newMessage);

    // 2. if other user is online send also message to him/her
  }
}

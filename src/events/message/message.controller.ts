import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Message } from './message.model';
import { MessageService } from './message.service';

@Controller()
export class MessageController {
  constructor(private messageService: MessageService) {}

  @MessagePattern('send-private-message')
  async getUserByAccessToken(message: Message) {
    await this.messageService.broadcastMessage(message);
  }
}

import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Message } from './message.model';
import { MessageService } from './message.service';

@Controller()
export class MessageController {
  constructor(private messageService: MessageService) {}

  @MessagePattern('send-private-message')
  getUserByAccessToken(message: Message): void {
    this.messageService.broadcastMessage(message);
  }
}

import { Injectable } from '@nestjs/common';
import { Message } from './message.model';
import { MessageRepository } from './message.repository';

@Injectable()
export class MessageService {
  constructor(private messageRepository: MessageRepository) {}

  async getMessages() {
    return this.messageRepository.getMessages();
  }

  //   async getEmployeeById(id: number) {
  //     return this.employeeRepository.getEmployeeById(id);
  //   }

  async createMessage(message: Message) {
    return this.messageRepository.createMessage(message);
  }

  //   async updateEmployeeName(id: number, name: string) {
  //     return this.employeeRepository.updateEmployeeName(id, name);
  //   }
}

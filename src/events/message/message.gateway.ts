import { BadRequestTransformationFilter } from '@core/filters/ws-bad-request.filter';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'ws';
import { CreateMessageDTO } from './dto/create-message.dto';
import { MessageService } from './message.service';

@UseFilters(BadRequestTransformationFilter)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private messageService: MessageService) {}

  @WebSocketServer() server: Server;

  handleDisconnect(client: any) {
    console.log('handleDisconnect', client);
  }

  handleConnection(client: any, ...args: any[]) {
    console.log('handleConnection', client);
  }

  afterInit(server: Server) {
    console.log('SERVER IS ', server.clients);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('identity')
  async identity(@MessageBody() message: CreateMessageDTO): Promise<number> {
    this.messageService.createMessage(message);
    return 2;
  }
}

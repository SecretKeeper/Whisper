import { BadRequestTransformationFilter } from '@core/filters/ws-bad-request.filter';
import { PhantomService } from '@core/phantoms/phantom.service';
import { Inject, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { lastValueFrom } from 'rxjs';
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
  constructor(
    @Inject('AUTH_MICROSERVICE') private readonly client: ClientProxy,
    @Inject('NATS') private readonly NATS: ClientProxy,
    private messageService: MessageService,
    private phantomService: PhantomService,
  ) {}

  @WebSocketServer() server: Server;

  handleDisconnect(client: any) {
    this.phantomService.disconnectPhantom(client.id);
  }

  async handleConnection(client: any, args: any) {
    const response = this.client.send(
      'get-user-by-access-token',
      args.headers.authorization.substring('Bearer '.length),
    );

    this.NATS.emit('qq', 'WW23345');

    // if token is valid JWTPayload & User should return

    const user = await lastValueFrom(response);

    // if user token is valid store client with user.id key, else the token is not valid and should drop connection
    client.id = user.id;
    if (user.id) this.phantomService.connectPhantom(user.id, client);
    else client.close();
  }

  afterInit(server: Server) {
    console.log('SERVER IS ', server.clients);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('create-message')
  identity(
    @MessageBody() message: CreateMessageDTO,
    @ConnectedSocket() client: any,
  ): void {
    this.messageService.createMessage(message, client);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('mark-as-read-message')
  seenMessage(
    @MessageBody() message_id: String[],
    @ConnectedSocket() client: any,
  ): void {
    this.messageService.markAsReadMessage(message_id);
  }
}

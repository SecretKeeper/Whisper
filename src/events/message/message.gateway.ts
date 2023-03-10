import { Inject, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Server } from 'ws';
import { lastValueFrom } from 'rxjs';
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
import { BadRequestTransformationFilter } from '@core/filters/ws-bad-request.filter';
import { PhantomService } from '@core/phantoms/phantom.service';
import { UnseenMessageConsumer } from '@/events/message/consumer/unseen-message.consumer';
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
    private unseenMessageConsumer: UnseenMessageConsumer,
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

    // if token is valid JWTPayload & User should return
    const phantom = await lastValueFrom(response);

    // if user token is valid store client with phantom.id key, else the token is not valid and should drop connection
    client.id = phantom.id;

    if (phantom.id) {
      this.phantomService.connectPhantom(phantom.id, client);

      await this.unseenMessageConsumer.sendUnseenMessagesToRecipient(
        phantom.id,
      );
    } else client.close();
  }

  afterInit(server: Server) {}

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('create-message')
  async identity(
    @MessageBody() message: CreateMessageDTO,
    @ConnectedSocket() client: any,
  ) {
    await this.messageService.createMessage(message, client);
  }

  @UsePipes(new ValidationPipe())
  @SubscribeMessage('mark-as-read-message')
  async seenMessage(
    @MessageBody() message_id: String[],
    @ConnectedSocket() client: any,
  ) {
    await this.messageService.markAsReadMessage(message_id);
  }
}

import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessageService } from './message.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway {
  constructor(private messageService: MessageService) {}

  @WebSocketServer()
  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    this.messageService.createMessage({
      id: 'QQ',
      // local_id: 'QQQ',
      // content: 'QQQQQQ',
      // sender: 'QQQQSender',
      // receiver: 'QQQReceiver',
      // created_at: 'QWEQW@#2313',
    });
    return data * 2;
  }
}

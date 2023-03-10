import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CassandraModule } from '@core/cassandra/cassandra.module';
import { MessagesGateway } from './message.gateway';
import { MessageRepository } from './message.repository';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { PhantomService } from '@core/phantoms/phantom.service';
import { PulsarService } from '@core/pulsar/pulsar.service';
import { UnseenMessageConsumer } from '@/events/message/consumer/unseen-message.consumer';

@Module({
  imports: [
    ClientsModule.register([
      { name: 'AUTH_MICROSERVICE', transport: Transport.TCP },
      {
        name: 'NATS',
        transport: Transport.NATS,
        options: {
          servers: ['nats://localhost:4222'],
        },
      },
    ]),
    CassandraModule,
  ],
  providers: [
    PulsarService,
    UnseenMessageConsumer,
    MessagesGateway,
    MessageService,
    MessageRepository,
    PhantomService,
  ],
  controllers: [MessageController],
  exports: [MessageRepository],
})
export class MessageModule {}

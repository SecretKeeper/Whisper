import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CassandraModule } from '@core/cassandra/cassandra.module';
import { MessagesGateway } from './message.gateway';
import { MessageRepository } from './message.repository';
import { MessageService } from './message.service';

@Module({
  imports: [
    ClientsModule.register([
      { name: 'AUTH_MICROSERVICE', transport: Transport.TCP },
    ]),
    CassandraModule,
  ],
  providers: [MessagesGateway, MessageService, MessageRepository],
  exports: [MessageRepository],
})
export class MessageModule {}

import { Module } from '@nestjs/common';
import { CassandraModule } from 'src/core/cassandra/cassandra.module';
import { MessagesGateway } from './message.gateway';
import { MessageRepository } from './message.repository';
import { MessageService } from './message.service';

@Module({
  imports: [CassandraModule],
  providers: [MessagesGateway, MessageService, MessageRepository],
  exports: [MessageRepository],
})
export class EventsModule {}

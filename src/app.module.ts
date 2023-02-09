import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/message/message.module';
import { CassandraModule } from './core/cassandra/cassandra.module';

@Module({
  imports: [ConfigModule.forRoot(), EventsModule, CassandraModule],
})
export class AppModule {}

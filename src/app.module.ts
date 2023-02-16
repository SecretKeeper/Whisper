import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MessageModule } from './events/message/message.module';
import { CassandraModule } from './core/cassandra/cassandra.module';

@Module({
  imports: [ConfigModule.forRoot(), CassandraModule, MessageModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

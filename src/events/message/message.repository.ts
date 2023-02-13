import { Injectable, OnModuleInit } from '@nestjs/common';
import { mapping } from 'cassandra-driver';
import { CassandraService } from '@core/cassandra/cassandra.service';
import { Message } from './message.model';

@Injectable()
export class MessageRepository implements OnModuleInit {
  constructor(private cassandraService: CassandraService) {}

  messageMapper: mapping.ModelMapper<Message>;

  onModuleInit() {
    const mappingOptions: mapping.MappingOptions = {
      models: {
        Message: {
          tables: ['messages'],
          mappings: new mapping.UnderscoreCqlToCamelCaseMappings(),
        },
      },
    };

    this.messageMapper = this.cassandraService
      .createMapper(mappingOptions)
      .forModel('Message');
  }

  async getMessages() {
    return (await this.messageMapper.findAll()).toArray();
  }

  async createMessage(message: Message) {
    return (await this.messageMapper.insert(message)).toArray();
  }
}

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
          tables: ['private_messages'],
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

  async markAsReedMessage(message_ids: String[]) {
    if (message_ids.length === 1)
      return (
        await this.messageMapper.update({ id: message_ids[0], seen: true })
      ).toArray();
    else {
      const modelBatchMapper = this.messageMapper.batching;
      const changes = message_ids.map((message_id) =>
        modelBatchMapper.update({ id: message_id, seen: true }),
      );
      return await this.cassandraService.mapper.batch(changes);
    }
  }
}

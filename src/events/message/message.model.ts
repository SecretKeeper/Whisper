import { types } from 'cassandra-driver';

export class Message {
  //   local_id: string;

  id: types.Uuid;

  sender: string;

  receiver: string;

  content: string;

  created_at: types.dataTypes.timestamp;
}

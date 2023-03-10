import { types } from 'cassandra-driver';

export class Message {
  //   local_id: string;

  id: types.Uuid;

  conversation_id: types.Uuid;

  sender_id: types.Uuid;

  recipient_id: types.Uuid;

  content: string;

  seen?: boolean;

  created_at: types.dataTypes.timestamp;

  updated_at?: types.dataTypes.timestamp;
}

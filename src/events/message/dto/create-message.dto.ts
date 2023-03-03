import { IsNotEmpty, IsOptional, IsUUID, Length } from 'class-validator';
import { types } from 'cassandra-driver';

export class CreateMessageDTO {
  @IsNotEmpty()
  local_id: string;

  @IsOptional()
  @IsUUID()
  id: types.Uuid;

  @IsOptional()
  @IsUUID()
  conversation_id: types.Uuid;

  @IsNotEmpty()
  @IsUUID()
  sender_id: types.Uuid;

  @IsNotEmpty()
  @IsUUID()
  recipient_id: types.Uuid;

  @IsNotEmpty()
  @Length(1, 4096)
  content: string;
}

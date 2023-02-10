import { IsNotEmpty, IsOptional, IsUUID, Length } from 'class-validator';

export class CreateMessage {
  @IsNotEmpty()
  local_id: string;

  @IsOptional()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsUUID()
  sender: string;

  @IsNotEmpty()
  @IsUUID()
  receiver: string;

  @IsNotEmpty()
  @Length(4096)
  content: string;

  @IsOptional()
  created_at: string;
}

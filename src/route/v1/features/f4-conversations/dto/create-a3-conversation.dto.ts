import { IsMongoId, IsOptional, IsString, ValidateIf } from 'class-validator';

export default class CreateA3ConversationDto {
  @IsMongoId()
  characterId: string;

  @IsMongoId()
  userId: string;

  @IsOptional()
  @IsString()
  chatName?: string;

  @IsOptional()
  @IsString()
  latestMessage?: string;

  @IsOptional()
  @IsString()
  latestReplyMessage?: string;
}

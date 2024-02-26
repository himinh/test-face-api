import { IsMongoId, IsOptional, IsString, ValidateIf } from 'class-validator';

export default class CreateA3MessageDto {
  @ValidateIf((o) => !o.userId)
  @IsMongoId()
  characterId: string;

  @ValidateIf((o) => !o.characterId)
  @IsMongoId()
  userId: string;

  @IsOptional()
  @IsMongoId()
  conversationId: string;

  @ValidateIf((o) => !(o.images || o.document))
  @IsString()
  text: string;

  @ValidateIf((o) => !(o.text || o.document))
  @IsString()
  images: string;

  @ValidateIf((o) => !(o.images || o.text))
  @IsString()
  document: string;

  @IsOptional()
  @IsString({ each: true })
  suggestionQuestions: [string];
}

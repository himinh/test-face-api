import { IsMongoId, IsOptional, IsString, ValidateIf } from 'class-validator';

export default class CreateA3DiyMessageDto {
  @ValidateIf((o) => !o.userId)
  @IsMongoId()
  diyId: string;

  @ValidateIf((o) => !o.diyId)
  @IsMongoId()
  userId: string;

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

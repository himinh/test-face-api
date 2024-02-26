import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export default class CreateA3DiyDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  firstMessage: string;

  @IsBoolean()
  @IsOptional()
  isAppDiy: boolean;

  @IsBoolean()
  @IsOptional()
  isCreatedByAdmin: boolean;
}

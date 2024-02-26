import { MultiLanguage } from '@interface/multi-language.interface';
import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export default class CreateA3CharacterDto {
  @IsNotEmpty()
  @IsArray()
  @IsMongoId({ each: true })
  categoryIds: string[];

  @IsOptional()
  @IsString()
  avatar: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  intro: String;

  @IsOptional()
  @IsObject()
  introMultiLanguage: MultiLanguage;

  @IsOptional()
  @IsString()
  firstMessage: string;

  @IsOptional()
  @IsNumber()
  countMessages: number;

  @IsOptional()
  @IsBoolean()
  isPro: boolean;

  @IsOptional()
  @IsNumber()
  position: number;

  @IsOptional()
  @IsNumber()
  categoryPosition: number;

  @IsOptional()
  @IsBoolean()
  isShow: boolean;

  @IsOptional()
  @IsString()
  introJob: string;
}

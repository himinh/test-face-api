import {
  IsArray,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { MultiLanguage } from 'src/util/types/multi-lang';

export default class CreateSettingDto {
  @IsOptional()
  @IsString()
  readonly policy: string;

  @IsOptional()
  @IsString()
  readonly logo: string;

  @IsOptional()
  @IsString()
  readonly transactionPolicy: string;

  @IsOptional()
  @IsString()
  readonly image: string;

  @IsOptional()
  @IsNumber()
  readonly countQuestionsFree: number;

  @IsOptional()
  @IsObject()
  privacyPolicy: MultiLanguage;

  @IsOptional()
  @IsObject()
  termsAndService: MultiLanguage;

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  priceList: any[];

  @IsOptional()
  @IsString()
  readonly apiKeyGoong: string;

  @IsOptional()
  @IsString()
  readonly ilTerms: string;

  @IsOptional()
  @IsString()
  readonly ilPolicy: string;

  @IsOptional()
  @IsString()
  readonly appEmail: string;

  @IsOptional()
  @IsString()
  readonly androidAppId: string;

  @IsOptional()
  @IsString()
  readonly iOSAppId: string;

  @IsOptional()
  @IsString()
  readonly termsOfServices: string;

  @IsOptional()
  @IsString()
  readonly linkShareAndroid: string;

  @IsOptional()
  @IsString()
  readonly linkShareIos: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly aiImages: string[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  readonly appShowRate: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  readonly saveFileShowRate: number[];

  @IsOptional()
  readonly other: any;
}

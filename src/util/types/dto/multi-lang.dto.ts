import { LangEnum } from '@enum/lang.enum';
import { IsNotEmpty, IsString } from 'class-validator';

export class MultiLanguageDto {
  @IsNotEmpty()
  @IsString()
  [LangEnum.english]: string;

  @IsNotEmpty()
  @IsString()
  [LangEnum.french]: string;

  @IsNotEmpty()
  @IsString()
  [LangEnum.hindi]: string;

  @IsNotEmpty()
  @IsString()
  [LangEnum.portuguese]: string;

  @IsNotEmpty()
  @IsString()
  [LangEnum.russian]: string;

  @IsNotEmpty()
  @IsString()
  [LangEnum.spanish]: string;
}

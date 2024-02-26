import { LangEnum } from '@enum/lang.enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class TextToAudioDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsEnum(LangEnum)
  lang: string;
}

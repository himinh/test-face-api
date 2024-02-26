import { MultiLanguage } from '@interface/multi-language.interface';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { MultiLanguageDto } from 'src/util/types/dto/multi-lang.dto';

export default class CreateA3CategoryDto {
  @IsNotEmpty()
  @Type(() => MultiLanguageDto)
  title: MultiLanguage;

  @IsOptional()
  @IsNumber()
  position: number;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @Type(() => MultiLanguageDto)
  description: MultiLanguage;
}

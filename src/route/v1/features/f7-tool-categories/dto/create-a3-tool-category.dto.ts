import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
} from 'class-validator';

export default class CreateA3ToolCategoryDto {
  @IsNotEmpty()
  @IsObject()
  name: Record<string, string>;

  @IsOptional()
  @IsNumber()
  position: number;

  @IsOptional()
  @IsArray()
  tools: {
    name: Record<string, string>;
    description: Record<string, string>;
    thumbnail: String;
    key: String;
    position: string;
  }[];
}

import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class UseToolDto {
  @IsString()
  @IsNotEmpty()
  toolKey: string;

  @IsNotEmpty()
  @IsMongoId()
  toolId: string;

  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsOptional()
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  image: string;
}

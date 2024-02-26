import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export default class SignInNameDto {
  @IsNotEmpty()
  @IsString()
  userName: string;

  @Length(6, 50)
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @MinLength(12)
  deviceID?: string;
}

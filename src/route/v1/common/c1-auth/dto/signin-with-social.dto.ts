import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import CreateUserDto from '@authorization/a1-user/dto/create-user.dto';
import { PartialType } from '@nestjs/mapped-types';
import { SocialType } from '@authorization/a1-user/enums/social-type.enum';

export default class SignInWithSocialDto extends PartialType(CreateUserDto) {
  @IsNotEmpty()
  @IsEnum(SocialType)
  socialType: SocialType;

  @IsNotEmpty()
  @IsString()
  socialKey: string;
}

import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';

import { RoleUser } from '@enum/role-user.enum';
import { ObjectId } from 'mongodb';
import { Gender } from '../enums/gender.enum';
import { SocialType } from '../enums/social-type.enum';

export default class CreateUserDto {
  @ValidateIf((o) => o.role === RoleUser.manager)
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  groups: ObjectId[];

  @ValidateIf((o) => o.role === RoleUser.manager)
  @IsOptional()
  @IsArray()
  groupDetails: any[];

  @ValidateIf((o) => o.role === RoleUser.manager)
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  groupAPIAccesses: ObjectId[];

  @ValidateIf((o) => o.role === RoleUser.manager)
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  groupAPIDenines: ObjectId[];

  @IsOptional()
  @IsString()
  deviceID: string;

  @IsOptional()
  @IsBoolean()
  isEnableFCM: boolean;

  @IsOptional()
  @IsString()
  avatar: string;

  @IsOptional()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  aiCodeLink: string;

  @IsOptional()
  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  @IsNumber()
  dateOfBirth: number;

  @IsOptional()
  @IsString()
  language: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  idPremium: string;

  @IsOptional()
  @IsBoolean()
  readonly isDeleted: boolean;

  @IsOptional()
  @IsEnum(RoleUser)
  readonly role: RoleUser;

  @IsOptional()
  @IsBoolean()
  isPremium: boolean;

  @IsOptional()
  @IsNumber()
  premiumStartDate: number;

  @IsOptional()
  @IsNumber()
  premiumEndDate: number;

  @IsOptional()
  @IsNumber()
  countMessages: number;

  @IsOptional()
  socialType: SocialType;

  @IsOptional()
  socialKey: string;

  @IsOptional()
  fcmTokens: string[];
}

import { LangEnum } from '@enum/lang.enum';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ObjectId } from 'mongodb';
import { TransactionMethodEnum } from '../enums/transaction-method.enum';
import { TransactionTypeEnum } from '../enums/transaction-type.enum';
import { TransactionStatusEnum } from '../enums/transaction-status.enum';

export default class CreateTransactionDto {
  @IsNotEmpty()
  @IsMongoId()
  readonly idUser: ObjectId;

  @IsOptional()
  @IsEnum(TransactionTypeEnum)
  readonly type: TransactionTypeEnum;

  @IsOptional()
  @IsEnum(TransactionMethodEnum)
  readonly method: TransactionMethodEnum;

  @IsOptional()
  @IsEnum(TransactionStatusEnum)
  readonly status: TransactionStatusEnum;

  @IsOptional()
  @IsObject()
  readonly title: { [key in LangEnum]: string };

  @IsOptional()
  @IsString()
  readonly bankName: string;

  @IsOptional()
  @IsString()
  readonly bankBranch: string;

  @IsOptional()
  @IsString()
  readonly accountName: string;

  @IsOptional()
  @IsString()
  readonly accountNumber: string;

  @IsOptional()
  @IsString()
  readonly image: string;

  @IsOptional()
  @IsObject()
  readonly content: { [key in LangEnum]: string };

  @IsOptional()
  @IsNumber()
  readonly totalMoney: number;

  @IsOptional()
  @IsString()
  readonly unitMoney: string;

  @IsOptional()
  @IsString()
  readonly phone: string;
}

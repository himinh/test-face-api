import { ObjectId } from 'mongodb';
import { Document, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LangEnum } from '@enum/lang.enum';
import { TransactionMethodEnum } from '../enums/transaction-method.enum';
import { TransactionTypeEnum } from '../enums/transaction-type.enum';
import { TransactionStatusEnum } from '../enums/transaction-status.enum';

export interface MultipleLanguage {
  [key: string]: string;
}

@Schema({ timestamps: true, versionKey: false })
export class Transaction {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  readonly idUser: ObjectId;

  @Prop({
    type: String,
    enum: TransactionTypeEnum,
    default: TransactionTypeEnum.WITHDRAW_MONEY,
  })
  readonly type: TransactionTypeEnum;

  @Prop({
    type: String,
    enum: TransactionMethodEnum,
    default: TransactionMethodEnum.TRANSFER,
  })
  readonly method: TransactionMethodEnum;

  @Prop({
    type: String,
    enum: TransactionStatusEnum,
    default: TransactionStatusEnum.CHECKING,
  })
  readonly status: TransactionStatusEnum;

  @Prop({ type: Object, default: { [LangEnum.english]: '' } })
  readonly title: MultipleLanguage;

  @Prop({ type: String, default: '' })
  readonly bankName: string;

  @Prop({ type: String, default: '' })
  readonly bankBranch: string;

  @Prop({ type: String, default: '' })
  readonly accountName: string;

  @Prop({ type: String, default: '' })
  readonly accountNumber: string;

  @Prop({ type: String, default: '' })
  readonly image: string;

  @Prop({ type: Object, default: { [LangEnum.english]: '' } })
  readonly content: MultipleLanguage;

  @Prop({ type: Number, default: '' })
  readonly totalMoney: number;

  @Prop({ type: String, default: '' })
  readonly unitMoney: string;

  @Prop({ type: String, default: '' })
  readonly phone: string;

  @Prop({ type: Number, default: 0 })
  readonly rewardDeadline: number;
}

export type TransactionDocument = Transaction & Document;
export const TransactionSchema = SchemaFactory.createForClass(Transaction);

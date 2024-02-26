import mongoose, { Document } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MultiLanguage } from 'src/util/types/multi-lang';
import { LangEnum } from '@enum/lang.enum';
import { ilPolicyDefault, ilTermsDefault } from '../policy';

@Schema({ timestamps: true, versionKey: false })
export class Setting {
  @Prop({ type: String, default: '' })
  readonly policy: string;

  @Prop({ type: String, default: '' })
  readonly logo: string;

  @Prop({ type: String, default: '' })
  readonly transactionPolicy: string;

  @Prop({ type: String, default: '' })
  readonly image: string;

  @Prop({ type: Number, default: 0 })
  readonly countQuestionsFree: number;

  @Prop({ type: Object, default: { [LangEnum.english]: '' } })
  privacyPolicy: MultiLanguage;

  @Prop({ type: Object, default: { [LangEnum.english]: '' } })
  termsAndService: MultiLanguage;

  @Prop({
    type: [
      {
        title: { type: Object, [LangEnum.english]: '' },
        money: Number,
        discountPercent: Number,
        unit: String,
        days: Number,
      },
    ],
    default: [],
  })
  priceList: {
    title: MultiLanguage;
    money: number;
    discountPercent: number;
    unit: string;
    days: number;
  }[];

  @Prop({ type: String, default: '' })
  readonly apiKeyGoong: string;

  @Prop({ type: String, default: '' })
  readonly appEmail: string;

  @Prop({ type: String, default: '' })
  readonly androidAppId: string;

  @Prop({ type: String, default: '' })
  readonly iOSAppId: string;

  @Prop({ type: String, default: '' })
  readonly termsOfServices: string;

  @Prop({ type: String, default: '' })
  readonly ilTermsOfServices: string;

  @Prop({
    type: String,
    default: ilTermsDefault,
  })
  readonly ilTerms: string;

  @Prop({ type: String, default: ilPolicyDefault })
  readonly ilPolicy: string;

  @Prop({ type: String, default: '' })
  readonly linkShareAndroid: string;

  @Prop({ type: String, default: '' })
  readonly linkShareIos: string;

  @Prop({ type: [String], default: [] })
  readonly aiImages: string[];

  @Prop({ type: [Number], default: [] })
  readonly appShowRate: number[];

  @Prop({ type: [Number], default: [] })
  readonly saveFileShowRate: number[];

  @Prop({ type: mongoose.SchemaTypes.Mixed, default: {} })
  readonly other: any;
}

export type SettingDocument = Setting & Document;
export const SettingSchema = SchemaFactory.createForClass(Setting);

import { Document, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MultiLanguage } from 'src/util/types/multi-lang';

@Schema({ timestamps: true, versionKey: false, collection: 'a3characters' })
export class A3Character {
  @Prop({ type: [{ type: String, ref: 'A3Category' }], default: [] })
  categoryIds: string[];

  @Prop({ type: String, default: '' })
  avatar: string;

  @Prop({ type: String, default: '' })
  name: string;

  @Prop({ type: String, default: '' })
  intro: string;

  @Prop({
    type: Object,
    default: {
      en: '',
      vi: '',
      pt: '',
      fr: '',
      es: '',
      hi: '',
      ru: '',
    },
  })
  introMultiLanguage: MultiLanguage;

  @Prop({ type: String, default: '' })
  firstMessage: string;

  @Prop({ type: Number, default: 0 })
  countMessages: number;

  @Prop({ type: Boolean, default: false })
  isPro: boolean;

  @Prop({ type: Number, default: 0 })
  position: number;

  @Prop({ type: Number, default: 0 })
  categoryPosition: number;

  @Prop({ type: Boolean, default: true })
  isShow: boolean;

  @Prop({ type: String, default: '' })
  introJob: string;
}

export type A3CharacterDocument = A3Character & Document;
export const A3CharacterSchema = SchemaFactory.createForClass(A3Character);

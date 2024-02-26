import { Document } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MultiLanguage } from 'src/util/types/multi-lang';

@Schema({ timestamps: true, versionKey: false, collection: 'a3categories' })
export class A3Category {
  @Prop({ type: Object, required: true })
  title: MultiLanguage;

  @Prop({ type: Number, default: 0 })
  position: number;

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
  description: MultiLanguage;

  @Prop({ type: String, default: '' })
  image: string;
}

export type A3CategoryDocument = A3Category & Document;
export const A3CategorySchema = SchemaFactory.createForClass(A3Category);

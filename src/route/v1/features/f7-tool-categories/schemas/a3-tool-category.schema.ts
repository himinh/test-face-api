import { Document } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MultiLanguage } from 'src/util/types/multi-lang';

@Schema({ timestamps: true, versionKey: false, collection: 'a3toolcategories' })
export class A3ToolCategory {
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
  name: MultiLanguage;

  @Prop({ type: Number, default: 0 })
  position: number;

  @Prop({
    type: [
      {
        position: Number,
        name: {
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
        },

        description: {
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
        },
        thumbnail: String,
        key: { type: String, required: true },
      },
    ],
    default: [],
  })
  tools: {
    position: number;
    name: Record<string, string>;
    description: Record<string, string>;
    thumbnail: String;
    key: { type: String; required: true };
  }[];
}

export type A3ToolCategoryDocument = A3ToolCategory & Document;
export const A3ToolCategorySchema =
  SchemaFactory.createForClass(A3ToolCategory);

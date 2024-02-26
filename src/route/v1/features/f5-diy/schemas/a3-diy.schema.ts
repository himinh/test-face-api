import { Document } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, versionKey: false, collection: 'a3diy' })
export class A3Diy {
  @Prop({ type: String, ref: 'User' })
  userId: string;

  @Prop({ type: Boolean, default: false })
  isAppDiy: boolean;

  @Prop({ type: String, default: '' })
  avatar: string;

  @Prop({ type: String, default: '' })
  description: string;

  @Prop({ type: String, default: '' })
  name: string;

  @Prop({ type: String, default: '' })
  firstMessage: string;

  @Prop({ type: Boolean, default: false })
  isCreatedByAdmin: boolean;
}

export type A3DiyDocument = A3Diy & Document;
export const A3DiySchema = SchemaFactory.createForClass(A3Diy);

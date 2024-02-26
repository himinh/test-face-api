import { Document } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, versionKey: false, collection: 'a3diymessages' })
export class A3DiyMessage {
  @Prop({ type: String, ref: 'A3Diy' })
  diyId: string;

  @Prop({ type: String, ref: 'User' })
  userId: string;

  @Prop({ type: String, default: '' })
  text: string;

  @Prop({ type: String, default: '' })
  images: string;

  @Prop({ type: String, default: '' })
  document: string;

  @Prop({ type: String, default: '' })
  replyFromBot: string;

  @Prop({ type: [String], default: [] })
  suggestionQuestions: string;
}

export type A3DiyMessageDocument = A3DiyMessage & Document;
export const A3DiyMessageSchema = SchemaFactory.createForClass(A3DiyMessage);

import { Document } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, versionKey: false, collection: 'a3messages' })
export class A3Message {
  @Prop({ type: String, ref: 'A3Character' })
  characterId: string;

  @Prop({ type: String, ref: 'User' })
  userId: string;

  @Prop({ type: String, ref: 'A3Conversation' })
  conversationId: string;

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

export type A3MessageDocument = A3Message & Document;
export const A3MessageSchema = SchemaFactory.createForClass(A3Message);

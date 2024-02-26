import { Document } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, versionKey: false, collection: 'a3conversations' })
export class A3Conversation {
  @Prop({ type: String, ref: 'A3Character' })
  characterId: string;

  @Prop({ type: String, ref: 'User' })
  userId: string;

  @Prop({ type: String, default: '' })
  chatName: string;

  @Prop({ type: String })
  latestMessage: string;

  @Prop({ type: String })
  latestReplyMessage: string;
}

export type A3ConversationDocument = A3Conversation & Document;
export const A3ConversationSchema =
  SchemaFactory.createForClass(A3Conversation);

A3ConversationSchema.index({ chatName: 'text' });

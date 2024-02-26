import { Document } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, versionKey: false, collection: 'a3feedbacks' })
export class A3Feedback {
  @Prop({ type: String, default: '' })
  deviceID: string;

  @Prop({ type: String, default: '' })
  customerName: string;

  @Prop({ type: String, default: '' })
  customerEmail: string;

  @Prop({ type: String, default: '' })
  feedbackText: string;

  @Prop({ type: String, default: '' })
  feedbackReply: string;

  @Prop({ type: [{ type: String }], default: [] })
  feedbackImages: string[];

  @Prop({ type: [{ type: String }], default: [] })
  feedbackFiles: string[];

  @Prop({ type: Number, default: 0 })
  rating: number;
}

export type A3FeedbackDocument = A3Feedback & Document;
export const A3FeedbackSchema = SchemaFactory.createForClass(A3Feedback);

import { Document } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { hash, verify } from 'argon2';

@Schema({ timestamps: true, versionKey: false })
export class Otp {
  @Prop({ type: String })
  phone: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String, required: true })
  otpCode: string;

  compareOtpCode: (candidateOtpCode: string) => Promise<boolean>;
}

export type OtpDocument = Otp & Document;
export const OtpSchema = SchemaFactory.createForClass(Otp);

// create index expires
OtpSchema.index({ updatedAt: 1 }, { expires: '5m' }); // Automatically delete documents after 5 minutes

/* eslint func-names: 0 */
// Pre save
OtpSchema.pre('save', async function (next: any) {
  const otp = this as OtpDocument;

  // Hash otp code
  otp.otpCode = await hash(otp.otpCode);

  return next();
});

// Schema methods
OtpSchema.methods.compareOtpCode = async function (candidateOtpCode: string) {
  const otpDoc = this as OtpDocument;

  return verify(candidateOtpCode, otpDoc.otpCode);
};

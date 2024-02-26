import { hash } from 'argon2';
import { ObjectId } from 'mongodb';
import { MethodRouteEnum } from '@enum/method-route.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GroupDetailType } from 'src/util/types/group-detail.type';
import { HydratedDocument } from 'mongoose';
import { SocialType } from '../enums/social-type.enum';
import { Gender } from '../enums/gender.enum';
import { RoleUser } from '@enum/role-user.enum';
import { LangEnum } from '@enum/lang.enum';
import { generateCodeLink } from '@helper/generate-code-link';

@Schema({ timestamps: true, versionKey: false, collection: 'users' })
export class User {
  // Authorizations
  @Prop({ type: [{ type: ObjectId, ref: 'Group' }] })
  groups: string[];

  @Prop({
    type: [
      {
        idGroupDetail: { type: ObjectId, ref: 'GroupDetail' },
        accessMethods: {
          type: [{ type: String, enum: MethodRouteEnum }],
          default: [MethodRouteEnum.GET],
        },
        createdAt: { type: Date, default: Date.now() },
      },
    ],
    default: [],
  })
  groupDetails: GroupDetailType[];

  @Prop({ type: [{ type: ObjectId, ref: 'GroupApi' }] })
  groupAPIAccesses: string[];

  @Prop({ type: [{ type: ObjectId, ref: 'GroupApi' }] })
  groupAPIDenines: string[];

  @Prop({ type: String, enum: SocialType, default: SocialType.google })
  socialType: SocialType;

  @Prop({ type: String })
  socialKey: string;

  @Prop({ type: String, default: '' })
  deviceID: string;

  @Prop({ type: [String], default: [] })
  fcmTokens: string[];

  @Prop({ type: Boolean, default: false })
  isEnableFCM: boolean;

  @Prop({ type: String, default: '' })
  avatar: string;

  @Prop({ type: [String], default: [] })
  coverPhotos: string[];

  @Prop({ type: String, default: '' })
  fullName: string;

  @Prop({ type: String, default: '' })
  email: string;

  @Prop({ type: String, enum: RoleUser, default: RoleUser.customer })
  readonly role: RoleUser;

  @Prop({ type: String, default: '' })
  password: string;

  @Prop({ type: String, enum: Gender, default: Gender.female })
  gender: Gender;

  @Prop({ type: Number, default: 0 })
  dateOfBirth: number;

  @Prop({ type: String, enum: LangEnum, default: LangEnum.english })
  language: LangEnum;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Boolean, default: false })
  isPremium: boolean;

  @Prop({ type: Number, default: 0 })
  premiumStartDate: number;

  @Prop({ type: Number, default: 0 })
  premiumEndDate: number;

  @Prop({ type: String, default: '' })
  idPremium: string;

  @Prop({ type: Number, default: 0 })
  countMessages: number;

  @Prop({ type: Number, default: 0 })
  countAskMessages: number;

  @Prop({ type: Number, default: 3 })
  aiCountFreeMessages: number;

  @Prop({ type: String, default: generateCodeLink() })
  aiCodeLink: string;

  @Prop({ type: Number, default: 0 })
  height: number;

  @Prop({ type: Number, default: 0 })
  weight: number;

  @Prop({ type: Number, default: 0 })
  targetWeight: number;

  @Prop({ type: Number, default: 0 })
  app5Rating: number;

  comparePassword: (candidatePassword: string) => boolean;
}

type UserDocument = HydratedDocument<User>;
const UserSchema = SchemaFactory.createForClass(User);

// Pre save
UserSchema.pre('save', async function preSave(next: any) {
  const user: any = this;

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // Hash password
  user.password = await hash(user.password);

  return next();
});

export { UserDocument, UserSchema };

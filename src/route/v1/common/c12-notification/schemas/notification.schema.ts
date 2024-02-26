import { HydratedDocument } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { NotificationType } from '../enum/notification-type.enum';
import { EntityType } from '../enum/entity-type.enum';
import { ThumbnailType } from '../enums/thumbnail-type';

@Schema({ timestamps: true, versionKey: false })
export class Notification {
  @Prop({ type: String, ref: 'User' })
  userFrom: string;

  @Prop({ type: String, ref: 'User' })
  userTo: string;

  @Prop({
    type: String,
    enum: NotificationType,
    default: NotificationType.personal,
  })
  type: NotificationType;

  @Prop({
    type: String,
    enum: EntityType,
    default: EntityType.empty,
  })
  entityType: EntityType;

  @Prop({ type: String })
  entityId: string;

  @Prop({ type: Object, default: { vi: '' } })
  title: {
    [key: string]: string;
  };

  @Prop({ type: Boolean, default: false })
  isOpened: false;

  @Prop({ type: Object, default: { vi: '' } })
  desc: {
    [key: string]: string;
  };

  @Prop({ type: String, default: '' })
  thumbnail: string;

  @Prop({ type: String, enum: ThumbnailType })
  readonly thumbnailType: ThumbnailType;
}

export type NotificationDocument = HydratedDocument<Notification>;
export const NotificationSchema = SchemaFactory.createForClass(Notification);

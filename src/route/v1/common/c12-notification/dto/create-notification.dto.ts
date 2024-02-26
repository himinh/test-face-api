import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { NotificationType } from '../enum/notification-type.enum';
import { EntityType } from '../enum/entity-type.enum';
import { ThumbnailType } from '../enums/thumbnail-type';

export default class CreateNotificationDto {
  @IsMongoId()
  userFrom: string;

  @IsMongoId()
  userTo: string;

  @IsOptional()
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsOptional()
  @IsEnum(EntityType)
  entityType: EntityType;

  @IsOptional()
  @IsMongoId()
  entityId: string;

  @IsOptional()
  title: {
    [key: string]: string;
  };

  @IsOptional()
  @IsBoolean()
  isOpened: false;

  @IsOptional()
  desc: {
    [key: string]: string;
  };

  @IsOptional()
  @IsString()
  thumbnail: string;

  @IsOptional()
  @IsEnum(ThumbnailType)
  readonly thumbnailType: ThumbnailType;
}

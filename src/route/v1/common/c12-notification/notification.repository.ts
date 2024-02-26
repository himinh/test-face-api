import { PaginateModel } from 'mongoose';

import BaseRepository from '@base-inherit/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import CreateNotificationDto from '@common/c12-notification/dto/create-notification.dto';
import {
  Notification,
  NotificationDocument,
} from './schemas/notification.schema';

@Injectable()
export default class NotificationRepository extends BaseRepository<NotificationDocument> {
  private notificationModel: PaginateModel<NotificationDocument>;

  constructor(
    @InjectModel(Notification.name) model: PaginateModel<NotificationDocument>,
  ) {
    super(model);
    this.notificationModel = model;
  }

  // create many
  async createMany(
    data: CreateNotificationDto[],
  ): Promise<NotificationDocument[]> {
    return await this.notificationModel.insertMany(data);
  }
}

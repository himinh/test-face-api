import { PaginateModel } from 'mongoose';

import BaseRepository from '@base-inherit/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  A3DiyMessage,
  A3DiyMessageDocument,
} from './schemas/a3-diy-message.schema';

@Injectable()
export default class A3DiyMessageRepository extends BaseRepository<A3DiyMessageDocument> {
  constructor(
    @InjectModel(A3DiyMessage.name)
    model: PaginateModel<A3DiyMessageDocument>,
  ) {
    super(model);
  }
}

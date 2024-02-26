import { PaginateModel } from 'mongoose';

import BaseRepository from '@base-inherit/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { A3Message, A3MessageDocument } from './schemas/a3-message.schema';

@Injectable()
export default class A3MessageRepository extends BaseRepository<A3MessageDocument> {
  constructor(
    @InjectModel(A3Message.name) model: PaginateModel<A3MessageDocument>,
  ) {
    super(model);
  }
}

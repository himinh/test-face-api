import { PaginateModel } from 'mongoose';

import BaseRepository from '@base-inherit/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { A3Feedback, A3FeedbackDocument } from './schemas/a3-feedback.schema';

@Injectable()
export default class A3FeedbackRepository extends BaseRepository<A3FeedbackDocument> {
  constructor(
    @InjectModel(A3Feedback.name) model: PaginateModel<A3FeedbackDocument>,
  ) {
    super(model);
  }
}

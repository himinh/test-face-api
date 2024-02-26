import { PaginateModel } from 'mongoose';

import BaseRepository from '@base-inherit/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { A3Diy, A3DiyDocument } from './schemas/a3-diy.schema';

@Injectable()
export default class A3DiyRepository extends BaseRepository<A3DiyDocument> {
  constructor(
    @InjectModel(A3Diy.name)
    model: PaginateModel<A3DiyDocument>,
  ) {
    super(model);
  }
}

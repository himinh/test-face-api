import { PaginateModel } from 'mongoose';

import BaseRepository from '@base-inherit/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { A3Category, A3CategoryDocument } from './schemas/a3-category.schema';

@Injectable()
export default class A3CategoryRepository extends BaseRepository<A3CategoryDocument> {
  constructor(
    @InjectModel(A3Category.name) model: PaginateModel<A3CategoryDocument>,
  ) {
    super(model);
  }
}

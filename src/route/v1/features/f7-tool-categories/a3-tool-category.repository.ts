import { PaginateModel } from 'mongoose';

import BaseRepository from '@base-inherit/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  A3ToolCategory,
  A3ToolCategoryDocument,
} from './schemas/a3-tool-category.schema';

@Injectable()
export default class A3ToolCategoryRepository extends BaseRepository<A3ToolCategoryDocument> {
  constructor(
    @InjectModel(A3ToolCategory.name)
    model: PaginateModel<A3ToolCategoryDocument>,
  ) {
    super(model);
  }
}

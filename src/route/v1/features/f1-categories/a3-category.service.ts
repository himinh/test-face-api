import BaseService from '@base-inherit/base.service';
import CustomLoggerService from '@lazy-module/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { A3CategoryDocument } from './schemas/a3-category.schema';
import A3CategoryRepository from './a3-category.repository';

@Injectable()
export default class A3CategoryService extends BaseService<A3CategoryDocument> {
  constructor(
    readonly logger: CustomLoggerService,
    readonly a3CategoryRepository: A3CategoryRepository,
  ) {
    super(logger, a3CategoryRepository);
  }
}

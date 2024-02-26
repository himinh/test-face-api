import BaseService from '@base-inherit/base.service';
import CustomLoggerService from '@lazy-module/logger/logger.service';
import { Injectable } from '@nestjs/common';

import { HttpClientService } from '@lazy-module/http-client/http-client.service';
import { A3FeedbackDocument } from './schemas/a3-feedback.schema';
import A3FeedbackRepository from './a3-feedback.repository';

@Injectable()
export default class A3FeedbackService extends BaseService<A3FeedbackDocument> {
  constructor(
    readonly logger: CustomLoggerService,
    readonly feedbackRepository: A3FeedbackRepository,
    readonly httpClientService: HttpClientService,
  ) {
    super(logger, feedbackRepository);
  }
}

import { PartialType } from '@nestjs/mapped-types';

import CreateA3FeedbackDto from './create-a3-feedback.dto';

export default class UpdateA3FeedbackDto extends PartialType(
  CreateA3FeedbackDto,
) {}

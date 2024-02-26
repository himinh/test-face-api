import { PartialType } from '@nestjs/mapped-types';

import CreateA3MessageDto from './create-a3-message.dto';

export default class UpdateA3MessageDto extends PartialType(
  CreateA3MessageDto,
) {}

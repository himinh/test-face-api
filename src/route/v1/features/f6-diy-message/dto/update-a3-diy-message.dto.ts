import { PartialType } from '@nestjs/mapped-types';

import CreateA3MessageDiyDto from './create-a3-diy-message.dto';

export default class UpdateA3DiyMessageDto extends PartialType(
  CreateA3MessageDiyDto,
) {}

import { PartialType } from '@nestjs/mapped-types';

import CreateA3ConversationDto from './create-a3-conversation.dto';

export default class UpdateA3ConversationDto extends PartialType(
  CreateA3ConversationDto,
) {}

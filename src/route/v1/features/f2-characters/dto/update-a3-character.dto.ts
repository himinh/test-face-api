import { PartialType } from '@nestjs/mapped-types';

import CreateA3CharacterDto from './create-a3-character.dto';

export default class UpdateA3CharacterDto extends PartialType(
  CreateA3CharacterDto,
) {}

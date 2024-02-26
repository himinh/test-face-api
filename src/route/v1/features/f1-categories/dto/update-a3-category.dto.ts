import { PartialType } from '@nestjs/mapped-types';

import CreateA3CategoryDto from './create-a3-category.dto';

export default class UpdateA3CategoryDto extends PartialType(
  CreateA3CategoryDto,
) {}

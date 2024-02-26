import { PartialType } from '@nestjs/mapped-types';
import CreateA3ToolCategoryDto from './create-a3-tool-category.dto';

export default class UpdateA3ToolCategoryDto extends PartialType(
  CreateA3ToolCategoryDto,
) {}

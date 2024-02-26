import { PartialType } from '@nestjs/mapped-types';

import CreateA3DiyDto from './create-a3-diy.dto';

export default class UpdateA3DiyDto extends PartialType(CreateA3DiyDto) {}

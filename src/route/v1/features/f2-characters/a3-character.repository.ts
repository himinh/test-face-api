import { PaginateModel } from 'mongoose';

import BaseRepository from '@base-inherit/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import {
  A3Character,
  A3CharacterDocument,
} from './schemas/a3-character.schema';

@Injectable()
export default class A3CharacterRepository extends BaseRepository<A3CharacterDocument> {
  constructor(
    @InjectModel(A3Character.name) model: PaginateModel<A3CharacterDocument>,
  ) {
    super(model);
  }
}

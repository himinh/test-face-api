import { PaginateModel } from 'mongoose';

import BaseRepository from '@base-inherit/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import {
  A3Conversation,
  A3ConversationDocument,
} from './schemas/a3-conversation.schema';
import CreateA3ConversationDto from './dto/create-a3-conversation.dto';

@Injectable()
export default class A3ConversationRepository extends BaseRepository<A3ConversationDocument> {
  constructor(
    @InjectModel(A3Conversation.name)
    model: PaginateModel<A3ConversationDocument>,
  ) {
    super(model);
  }
}

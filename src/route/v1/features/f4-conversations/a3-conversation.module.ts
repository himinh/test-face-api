import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  A3Conversation,
  A3ConversationSchema,
} from './schemas/a3-conversation.schema';
import A3ConversationController from './a3-conversation.controller';
import A3ConversationRepository from './a3-conversation.repository';
import A3ConversationService from './a3-conversation.service';
import A3CharacterModule from '../f2-characters/a3-character.module';
import A3MessageModule from '../f3-messages/a3-message.module';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: A3Conversation.name,
        schema: A3ConversationSchema,
      },
    ]),
    A3CharacterModule,
    A3MessageModule,
  ],
  controllers: [A3ConversationController],
  providers: [A3ConversationService, A3ConversationRepository],
  exports: [A3ConversationService, A3ConversationRepository],
})
export default class A3ConversationModule {}

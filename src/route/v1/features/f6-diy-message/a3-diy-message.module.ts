import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  A3DiyMessage,
  A3DiyMessageSchema,
} from './schemas/a3-diy-message.schema';
import A3DiyMessageController from './a3-diy-message.controller';
import A3DiyMessageRepository from './a3-diy-message.repository';
import A3DiyMessageService from './a3-diy-message.service';
import BotService from '@lazy-module/bots/bot.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: A3DiyMessage.name,
        schema: A3DiyMessageSchema,
      },
    ]),
  ],
  controllers: [A3DiyMessageController],
  providers: [A3DiyMessageService, A3DiyMessageRepository, BotService],
  exports: [A3DiyMessageService, A3DiyMessageRepository],
})
export default class A3DiyMessageModule {}

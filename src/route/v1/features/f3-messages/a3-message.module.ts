import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { A3Message, A3MessageSchema } from './schemas/a3-message.schema';
import A3MessageController from './a3-message.controller';
import A3MessageRepository from './a3-message.repository';
import A3MessageService from './a3-message.service';
import BotService from '@lazy-module/bots/bot.service';
import A3CharacterModule from '../f2-characters/a3-character.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: A3Message.name,
        schema: A3MessageSchema,
      },
    ]),
    A3CharacterModule,
  ],
  controllers: [A3MessageController],
  providers: [A3MessageService, A3MessageRepository, BotService],
  exports: [A3MessageService, A3MessageRepository],
})
export default class A3MessageModule {}

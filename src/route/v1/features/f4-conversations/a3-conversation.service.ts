import BaseService from '@base-inherit/base.service';
import CustomLoggerService from '@lazy-module/logger/logger.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { A3ConversationDocument } from './schemas/a3-conversation.schema';
import A3ConversationRepository from './a3-conversation.repository';
import UpdateA3ConversationDto from './dto/update-a3-conversation.dto';
import CreateA3ConversationDto from './dto/create-a3-conversation.dto';
import A3MessageRepository from '../f3-messages/a3-message.repository';
import A3CharacterService from '../f2-characters/a3-character.service';

@Injectable()
export default class A3ConversationService extends BaseService<A3ConversationDocument> {
  constructor(
    readonly logger: CustomLoggerService,
    readonly a3ConversationRepository: A3ConversationRepository,
    readonly messageRepository: A3MessageRepository,
    readonly characterService: A3CharacterService,
  ) {
    super(logger, a3ConversationRepository);
  }

  async updateLatestMessage(data: UpdateA3ConversationDto) {
    const a3Conversation = await this.a3ConversationRepository.findOneBy({
      userId: data.userId,
      characterId: data.characterId,
    });

    if (a3Conversation)
      return this.a3ConversationRepository.updateOneById(a3Conversation._id, {
        latestMessage: data.latestMessage,
        latestReplyMessage: data.latestReplyMessage,
      });

    return this.a3ConversationRepository.create(data);
  }

  async createConversation(data: CreateA3ConversationDto) {
    const character = await this.characterService.findOneById(data.characterId);

    if (!character) throw new NotFoundException('Character not found.');

    const conversation = await this.a3ConversationRepository.create({
      ...data,
      latestReplyMessage: character.firstMessage || 'Hello!',
      chatName: character.name,
    });

    await this.messageRepository.create({
      replyFromBot: character.firstMessage || 'Hello!',
      userId: data.userId,
      characterId: character._id.toString(),
      conversationId: conversation._id.toString(),
    });

    return conversation;
  }
}

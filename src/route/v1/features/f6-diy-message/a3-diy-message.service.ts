import BaseService from '@base-inherit/base.service';
import CustomLoggerService from '@lazy-module/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { A3DiyMessageDocument } from './schemas/a3-diy-message.schema';
import A3DiyMessageRepository from './a3-diy-message.repository';
import CreateA3DiyMessageDto from './dto/create-a3-diy-message.dto';
import UserService from '@authorization/a1-user/user.service';
import WebsocketCustomGateway from '@lazy-module/websocket-custom/websocket-custom.gateway';
import BotService from '@lazy-module/bots/bot.service';
import A3DiyService from '../f5-diy/a3-diy.service';

@Injectable()
export default class A3DiyMessageService extends BaseService<A3DiyMessageDocument> {
  constructor(
    readonly logger: CustomLoggerService,
    readonly a3DiyMessageRepository: A3DiyMessageRepository,
    readonly websocketCustomGateway: WebsocketCustomGateway,
    readonly userService: UserService,
    readonly a3DiyService: A3DiyService,
    readonly botService: BotService,
  ) {
    super(logger, a3DiyMessageRepository);
  }

  async createFirstMessage(diyId: string, userId: string) {
    const foundMessage = await this.a3DiyMessageRepository.findOneBy({
      diyId,
      userId,
    });
    if (foundMessage) return;

    const diy = await this.a3DiyService.findOneById(diyId);

    if (!diy) return;

    return this.a3DiyMessageRepository.create({
      userId,
      diyId,
      replyFromBot: diy.firstMessage || 'Hello!',
    });
  }

  async createA3Message(data: CreateA3DiyMessageDto) {
    const [sender, diy] = await Promise.all([
      this.userService.findOneById(data.userId, {
        projection: {
          fullName: 1,
          avatar: 1,
          language: 1,
        },
      }),
      this.a3DiyService.findOneById(data.diyId, {
        projection: {
          avatar: 1,
          description: 1,
          name: 1,
          firstMessage: 1,
        },
      }),
    ]);

    // get reply
    const replyFromBot = await this._getReplyFromBot({
      diy,
      userId: data.userId,
      text: data.text,
    });

    const suggestionQuestions = await this._getSuggestions(replyFromBot);

    // send socket
    this.websocketCustomGateway.handleSendReplyFromBot({
      characterId: {
        avatar: diy.avatar,
        name: diy.name,
      },
      document: data.document,
      images: data.images,
      replyFromBot,
      text: data.text,
      userId: {
        avatar: sender!.avatar,
        fullName: sender!.fullName,
      },
    });

    // increase count a3Messages
    Promise.all([this.userService.increaseCountMessages(data.userId)])
      .then(() => {})
      .catch(() => {});

    return this.a3DiyMessageRepository.create({
      ...data,
      replyFromBot,
      suggestionQuestions,
    });
  }

  async clearConversation(diyId: string) {
    const firstMessage = await this.a3DiyMessageRepository.findOneBy(
      { diyId },
      {
        sort: { createdAt: 1 },
        populate: {
          path: 'diyId',
        },
      },
    );

    await this.a3DiyMessageRepository.deleteManyHard({ diyId });

    const { diyId: diy } = firstMessage;

    return this.a3DiyMessageRepository.create({
      userId: firstMessage.userId,
      diyId,
      replyFromBot: diy.firstMessage || 'Hello!',
    });
  }

  async _getReplyFromBot(data: {
    diy: {
      _id: string;
      name: string;
    };
    userId: string;
    text: string;
  }) {
    const oldChatA3Messages = await this.a3DiyMessageRepository.findManyBy(
      { diyId: data.diy._id.toString(), userId: data.userId },
      {
        projection: {
          text: 1,
          replyFromBot: 1,
          image: 1,
          document: 1,
          createdAt: 1,
        },
        sort: {
          createdAt: -1,
        },
        limit: 10,
      },
    );

    const promptList: string[] = [];
    if (oldChatA3Messages.length > 0)
      oldChatA3Messages
        .sort(
          (a: { createdAt: string }, b: { createdAt: string }) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        )
        .forEach((chat: { text: string; replyFromBot: string }) => {
          if (chat.text) {
            promptList.push(
              `\nChatPerson: "${chat.text.trim().replace(/\n\s*\n/g, '\n')}"`,
            );
            if (chat.replyFromBot)
              promptList.push(
                `\n${data.diy.name}: "${chat.replyFromBot
                  .trim()
                  .replace(/\n\s*\n/g, '\n')}"`,
              );
          }
        });

    const promptListData = promptList
      .join('')
      .trim()
      .replace(/\n\s*\n/g, '\n');

    // Update valid prompt content
    // const MAX_PROMPT_CONTENT = 3500;
    // const promptLength = promptListData.length;

    // if (promptLength > MAX_PROMPT_CONTENT) {
    //   promptListDataValid = promptListData.substring(
    //     promptLength - MAX_PROMPT_CONTENT,
    //     promptLength,
    //   );
    // }

    //     const prompt = `I want you to be ${data.character.name} continue talk with ChatPerson
    // Note:
    // + Based on the dialogue, (If this dialogue contains relevant information to the question, then use that data to answer. Otherwise, ignore the data from the dialogue. (Do not include the dialogue in the answer)):
    // [${promptListData}].

    // + The answering style should be similar to ${data.character.name}.
    // + In cases where the question is related to you (chatBot), please respond in the role of ${data.character.name}.
    // + Do not mention that you are a chatBot, In this answer, you are ${data.character.name}.
    // + Do not respond in the following manner: I'm sorry, but I am an AI language model and I cannot play the role of ${data.character.name}.(Because I want you to be ${data.character.name} to answer the question for me)
    // + Do not repeat the name ${data.character.name} with responses given like: "${data.character.name}:, [${data.character.name}]"
    // + Do not repeat the name ${data.character.name}, unless the question is about ${data.character.name} itself.
    // + The answer should be concise and easy to understand.
    // Please understand that you are ${data.character.name} not a chatBot, you are acting as: ${data.character.name}.

    // Based on the information provided, help me answer (Use the correct language of the question to respond, for example, if asked in English, answer in English, if asked in Vietnamese, answer in Vietnamese,...):
    // ${data.text}
    // `;

    const prompt = `
+ Bên dưới là đoạn hội thoại trước đó, Nếu đoạn hội thoại này liên quan đến câu trả lời, vui lòng dựa vào thông tin trong hội thoại để phản hồi lại, nếu không có, thì bỏ đoạn hội thoại để trả lời mới: 
[${promptListData}]. 
Dựa trên các nội dung trên, phản hồi nội dung sau ( câu phản hồi phải theo đúng ngôn ngữ ChatPerson đang dùng để hỏi):
${data.text}
`;

    // generate reply
    const replyFromBot = await this.botService.generateResponseGPT4(prompt);

    return replyFromBot;
  }

  async _getSuggestions(replyFromBot: string) {
    const suggestions = await this.botService.generateResponseGPT4(
      `Provide two concise questions for the following content (those questions must be in the current language): "${replyFromBot}"`,
    );

    if (suggestions) {
      const questionArray = suggestions
        .match(/\d+\.\s(.+?)(?=\s\d+\.\s|\s*$)/g)
        ?.map((question) => question.replace(/^\d+\.\s/, ''));

      return questionArray;
    }

    return [];
  }
}

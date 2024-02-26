import BaseService from '@base-inherit/base.service';
import CustomLoggerService from '@lazy-module/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { A3MessageDocument } from './schemas/a3-message.schema';
import A3MessageRepository from './a3-message.repository';
import CreateA3MessageDto from './dto/create-a3-message.dto';
import BotService from '@lazy-module/bots/bot.service';
import WebsocketCustomGateway from '@lazy-module/websocket-custom/websocket-custom.gateway';
import UserService from '@authorization/a1-user/user.service';
import A3CharacterService from '../f2-characters/a3-character.service';
import A3ConversationService from '../f4-conversations/a3-conversation.service';

@Injectable()
export default class A3MessageService extends BaseService<A3MessageDocument> {
  constructor(
    readonly logger: CustomLoggerService,
    readonly a3MessageRepository: A3MessageRepository,
    readonly characterService: A3CharacterService,
    readonly userService: UserService,
    readonly botService: BotService,
    readonly conversationService: A3ConversationService,
    private readonly websocketCustomGateway: WebsocketCustomGateway,
  ) {
    super(logger, a3MessageRepository);
  }

  async createA3Message(data: CreateA3MessageDto) {
    const [sender, character] = await Promise.all([
      this.userService.findOneById(data.userId, {
        projection: {
          fullName: 1,
          avatar: 1,
          language: 1,
        },
      }),
      this.characterService.findOneById(data.characterId, {
        projection: {
          name: 1,
          avatar: 1,
          introJob: 1,
        },
      }),
    ]);

    // get reply
    const replyFromBot = await this._getReplyFromBot({
      character,
      userId: data.userId,
      text: data.text,
    });

    const suggestionQuestions = await this._getSuggestions(replyFromBot);

    // update conversation latest a3Message
    const conversation = await this.conversationService.updateLatestMessage({
      characterId: data.characterId,
      userId: data.userId,
      latestMessage: data.text || 'Ask questions using media.',
      latestReplyMessage: replyFromBot,
      chatName: character.name,
    });

    // send socket
    this.websocketCustomGateway.handleSendReplyFromBot({
      characterId: {
        avatar: character.avatar,
        name: character.name,
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
    Promise.all([
      this.characterService.increaseCountMessages(data.characterId),
      this.userService.increaseCountMessages(data.userId),
    ])
      .then(() => {})
      .catch(() => {});

    return this.a3MessageRepository.create({
      ...data,
      replyFromBot,
      conversationId: conversation._id.toString(),
      suggestionQuestions,
    });
  }

  async clearConversation(conversationId: string) {
    const firstMessage = await this.a3MessageRepository.findOneBy(
      { conversationId },
      {
        sort: { createdAt: 1 },
        populate: {
          path: 'characterId',
        },
      },
    );

    await this.a3MessageRepository.deleteManyHard({ conversationId });

    const { characterId: character } = firstMessage;

    const [newMessage] = await Promise.all([
      this.a3MessageRepository.create({
        replyFromBot: character.firstMessage || 'Hello!',
        userId: firstMessage.userId,
        conversationId,
        characterId: character._id.toString(),
      }),
      this.conversationService.updateOneById(conversationId, {
        latestReplyMessage: character.firstMessage || 'Hello !',
      }),
    ]);

    return newMessage;
  }

  async _getReplyFromBot(data: {
    character: {
      _id: string;
      name: string;
      introJob: string;
    };
    userId: string;
    text: string;
  }) {
    const oldChatA3Messages = await this.a3MessageRepository.findManyBy(
      { characterId: data.character._id.toString(), userId: data.userId },
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
                `\n${data.character.name}: "${chat.replyFromBot
                  .trim()
                  .replace(/\n\s*\n/g, '\n')}"`,
              );
          }
        });

    const promptListData = promptList
      .join('')
      .trim()
      .replace(/\n\s*\n/g, '\n');
    let promptListDataValid = promptListData;

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

    const prompt = `Tôi muốn bạn đặt mình vào vị trí ${data.character.name} để tiếp tục cuộc hội thoại với ChatPerson
Lưu ý:
+ Bên dưới là đoạn hội thoại trước đó, Nếu đoạn hội thoại này liên quan đến câu trả lời, vui lòng dựa vào thông tin trong hội thoại để phản hồi lại, nếu không có, thì bỏ đoạn hội thoại để trả lời mới: 
[${promptListData}]. 

+ Phong cách phản hồi tin nhắn tương tự ${data.character.name}.
+ Chú ý các trường hợp, nếu câu hỏi hỏi về bạn, chatBot thì điều này mang ý nghĩa là đang hỏi về ${data.character.name}, hãy trả lời các thông tin liên quan đến ${data.character.name}.
+ Chú ý nhân xưng, ở đây bạn đang là ${data.character.name} trong cuộc hội thoại, không phải là chatBot
+ Không trả lời các câu hỏi kiểu như: I'm sorry, but I am an AI language model and I cannot play the role of ${data.character.name}. Bạn đang là ${data.character.name}
+ Câu trả lời/phản hồi nên đơn giản dễ hiểu.
+ Hãy hiểu rằng, ChatPerson đang nói  chuyện với ${data.character.name}, vậy nên khi bạn trả lời, thì bạn đang là ${data.character.name}.
+ Câu trả lời của bạn không viết lại tên để phản hồi như: "${data.character.name}: xin chào,....", vì câu trả lời tiếp theo ChatPerson biết chắc chắn bạn là ${data.character.name} rồi. vui lòng xóa "${data.character.name}: " ra khỏi câu. 

Dựa trên các nội dung/lưu ý trên, phản hồi nội dung sau ( câu phản hồi phải theo đúng ngôn ngữ ChatPerson đang dùng để hỏi):
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

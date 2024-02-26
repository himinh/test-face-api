import BaseService from '@base-inherit/base.service';
import CustomLoggerService from '@lazy-module/logger/logger.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import A3ToolCategoryRepository from './a3-tool-category.repository';
import { A3ToolCategoryDocument } from './schemas/a3-tool-category.schema';
import UseToolDto from './dto/use-tool.dto';
import BotService from '@lazy-module/bots/bot.service';
import UserService from '@authorization/a1-user/user.service';

@Injectable()
export default class A3ToolCategoryService extends BaseService<A3ToolCategoryDocument> {
  constructor(
    readonly logger: CustomLoggerService,
    readonly a3ToolCategoryRepository: A3ToolCategoryRepository,
    readonly botService: BotService,
    readonly userService: UserService,
  ) {
    super(logger, a3ToolCategoryRepository);
  }

  async useTool(data: UseToolDto) {
    const tool = await this.a3ToolCategoryRepository.findOneBy(
      {
        tools: {
          $elemMatch: {
            _id: data.toolId,
            key: data.toolKey,
          },
        },
      },
      { projection: { name: 1, tools: { $elemMatch: { _id: data.toolId } } } },
    );

    if (!tool) throw new NotFoundException('Tool not found.');

    const reply = await this._getReplyFromBot(
      tool.name.en,
      data.toolKey,
      tool.tools[0]?.description?.en || '',
      data.message,
    );

    // increase count a3Messages
    Promise.all([this.userService.increaseCountMessages(data.userId)])
      .then(() => {})
      .catch(() => {});

    return { reply };
  }

  async _getReplyFromBot(
    toolName: string,
    toolKey: string,
    description: string,
    text: string,
  ) {
    const prompt = `Câu trả lời theo chủ đề ${toolName}, có keyword là ${toolKey}.
    Lưu ý:
    + Câu trả lời phải ngắn gọn, dễ hiểu
    + Giải quyết vấn đề: ${description}
    + Có sử dụng và trả lời dựa theo ngôn ngữ của gợi ý ${text}             
    `;

    // generate reply
    const replyFromBot = await this.botService.generateResponseGPT4(prompt);

    return replyFromBot;
  }
}

import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  A3ToolCategory,
  A3ToolCategorySchema,
} from './schemas/a3-tool-category.schema';
import A3ToolCategoryController from './a3-tool-category.controller';
import A3ToolCategoryRepository from './a3-tool-category.repository';
import A3ToolCategoryService from './a3-tool-category.service';
import BotService from '@lazy-module/bots/bot.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: A3ToolCategory.name,
        schema: A3ToolCategorySchema,
      },
    ]),
  ],
  controllers: [A3ToolCategoryController],
  providers: [A3ToolCategoryService, A3ToolCategoryRepository, BotService],
  exports: [A3ToolCategoryService, A3ToolCategoryRepository],
})
export default class A3ToolCategoryModule {}

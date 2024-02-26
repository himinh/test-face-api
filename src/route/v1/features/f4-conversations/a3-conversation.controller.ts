import { Types } from 'mongoose';

import { ApiQueryParams } from '@decorator/api-query-params.decorator';
import AqpDto from '@interceptor/aqp/aqp.dto';
import WrapResponseInterceptor from '@interceptor/wrap-response.interceptor';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import ParseObjectIdPipe from '@pipe/parse-object-id.pipe';

import CreateA3ConversationDto from './dto/create-a3-conversation.dto';
import UpdateA3ConversationDto from './dto/update-a3-conversation.dto';
import A3ConversationService from './a3-conversation.service';

@ApiTags('A3Conversations')
@UseInterceptors(WrapResponseInterceptor)
@Controller()
export default class A3ConversationController {
  constructor(private readonly a3ConversationService: A3ConversationService) {}

  /**
   * Find all
   *
   * @param query
   * @returns
   */
  @Get('')
  @HttpCode(200)
  async findAll(
    @ApiQueryParams() { filter, population, ...options }: AqpDto,
  ): Promise<any> {
    if (filter.chatName) {
      filter.$text = { $search: filter.chatName };
      delete filter.chatName;
    }

    const result = await this.a3ConversationService.findManyBy(filter, {
      populate: population,
      ...options,
    });
    return result;
  }

  @Get('with')
  @HttpCode(200)
  async getA3ConversationWith(
    @ApiQueryParams() { filter, population, projection }: AqpDto,
  ) {
    const a3Conversation = await this.a3ConversationService.findOneBy(
      {
        characterId: filter.characterId,
        userId: filter.userId,
      },
      { populate: population, projection },
    );

    if (a3Conversation) return a3Conversation;

    const con = await this.a3ConversationService.createConversation({
      characterId: filter.characterId,
      userId: filter.userId,
    });

    return this.a3ConversationService.findOneById(con._id, {
      populate: population,
      projection,
    });
  }

  /**
   * Create
   *
   * @param body
   * @returns
   */
  @Post('')
  @HttpCode(201)
  async create(@Body() body: CreateA3ConversationDto): Promise<any> {
    return this.a3ConversationService.createConversation(body);
  }

  /**
   * Update by ID
   *
   * @param id
   * @param body
   * @returns
   */
  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() body: UpdateA3ConversationDto,
  ): Promise<any> {
    const result = await this.a3ConversationService.updateOneById(id, body);

    return result;
  }

  /**
   * Delete hard many by ids
   *
   * @param ids
   * @returns
   */
  @Delete(':ids/ids')
  // @HttpCode(204)
  async deleteManyByIds(@Param('ids') ids: string): Promise<any> {
    const result = await this.a3ConversationService.deleteManyHardByIds(
      ids.split(',').map((item: any) => new Types.ObjectId(item)),
    );
    return result;
  }

  /**
   * Delete by ID
   *
   * @param id
   * @returns
   */
  @Delete(':id')
  // @HttpCode(204)
  async delete(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<any> {
    const result = await this.a3ConversationService.deleteOneHardById(id);

    return result;
  }

  @Get('with')
  @HttpCode(200)
  async getConversationWith(
    @Query('characterId') characterId: string,
    @Query('userId') userId: string,
  ) {
    const conversation = await this.a3ConversationService.findOneBy({
      characterId,
      userId,
    });

    if (conversation) return conversation;

    return this.a3ConversationService.createConversation({
      characterId,
      userId,
    });
  }

  /**
   * Paginate
   *
   * @param query
   * @returns
   */
  @Get('paginate')
  @HttpCode(200)
  async paginate(@ApiQueryParams() query: AqpDto): Promise<any> {
    if (query.filter.chatName) {
      query.filter.$text = { $search: query.filter.chatName };
      delete query.filter.chatName;
    }

    return this.a3ConversationService.paginate(query);
  }

  /**
   * Find one by ID
   *
   * @param id
   * @returns
   */
  @Get(':id')
  @HttpCode(200)
  async findOneById(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @ApiQueryParams() { population, projection }: AqpDto,
  ): Promise<any> {
    const result = await this.a3ConversationService.findOneById(id, {
      populate: population,
      projection,
    });

    if (!result) throw new NotFoundException('The item does not exist');

    return result;
  }
}

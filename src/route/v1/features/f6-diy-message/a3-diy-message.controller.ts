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

import CreateA3DiyMessageDto from './dto/create-a3-diy-message.dto';
import UpdateA3DiyMessageDto from './dto/update-a3-diy-message.dto';
import A3DiyMessageService from './a3-diy-message.service';

@ApiTags('A3DiyMessages')
@UseInterceptors(WrapResponseInterceptor)
@Controller()
export default class A3DiyMessageController {
  constructor(private readonly a3DiyMessageService: A3DiyMessageService) {}

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
    return this.a3DiyMessageService.findManyBy(filter, {
      populate: population,
      ...options,
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
  async create(@Body() body: CreateA3DiyMessageDto): Promise<any> {
    return this.a3DiyMessageService.createA3Message(body);
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
    @Body() body: UpdateA3DiyMessageDto,
  ): Promise<any> {
    const result = await this.a3DiyMessageService.updateOneById(id, body);

    return result;
  }

  /**
   * Clear conversations
   *
   * @param ids
   * @returns
   */
  @Delete(':diyId/clear-diy')
  @HttpCode(200)
  async clearConversations(@Param('diyId') diyId: string) {
    return this.a3DiyMessageService.clearConversation(diyId);
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
    const result = await this.a3DiyMessageService.deleteManyHardByIds(
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
    const result = await this.a3DiyMessageService.deleteOneHardById(id);

    return result;
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
    if (query.filter.diyId && query.filter.userId) {
      await this.a3DiyMessageService.createFirstMessage(
        query.filter.diyId,
        query.filter.userId,
      );
    }

    return this.a3DiyMessageService.paginate(query);
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
    const result = await this.a3DiyMessageService.findOneById(id, {
      populate: population,
      projection,
    });

    if (!result) throw new NotFoundException('The item does not exist');

    return result;
  }
}

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
import A3ToolCategoryService from './a3-tool-category.service';
import CreateA3ToolCategoryDto from './dto/create-a3-tool-category.dto';
import UpdateA3ToolCategoryDto from './dto/update-a3-tool-category.dto';
import UseToolDto from './dto/use-tool.dto';
import { GetCurrentUserId } from '@decorator/get-current-user-id.decorator';
import { convertDataByLang } from '@helper/convert-data-lang';

@ApiTags('A3ToolCategorys')
@UseInterceptors(WrapResponseInterceptor)
@Controller()
export default class A3ToolCategoryController {
  constructor(private readonly a3ToolCategoryService: A3ToolCategoryService) {}

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
    const result = await this.a3ToolCategoryService.findManyBy(filter, {
      populate: population,
      ...options,
    });

    return result;
  }

  /**
   * Create
   *
   * @param body
   * @returns
   */
  @Post('/use')
  @HttpCode(201)
  async useTool(@Body() body: UseToolDto): Promise<any> {
    return this.a3ToolCategoryService.useTool(body);
  }

  /**
   * Create
   *
   * @param body
   * @returns
   */
  @Post('')
  @HttpCode(201)
  async create(@Body() body: CreateA3ToolCategoryDto): Promise<any> {
    return this.a3ToolCategoryService.create(body);
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
    @Body() body: UpdateA3ToolCategoryDto,
  ): Promise<any> {
    const result = await this.a3ToolCategoryService.updateOneById(id, body);

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
    const result = await this.a3ToolCategoryService.deleteManyHardByIds(
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
    const result = await this.a3ToolCategoryService.deleteOneHardById(id);

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
    return this.a3ToolCategoryService.paginate(query);
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
    @ApiQueryParams('population') populate: AqpDto,
  ): Promise<any> {
    const result = await this.a3ToolCategoryService.findOneById(id, {
      populate,
    });

    if (!result) throw new NotFoundException('The item does not exist');

    return result;
  }
}

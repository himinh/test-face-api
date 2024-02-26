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
import CreateA3CategoryDto from './dto/create-a3-category.dto';
import UpdateA3CategoryDto from './dto/update-a3-category.dto';
import A3CategoryService from './a3-category.service';

@ApiTags('A3Categorys')
@UseInterceptors(WrapResponseInterceptor)
@Controller()
export default class A3CategoryController {
  constructor(private readonly a3CategoryService: A3CategoryService) {}

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
    return this.a3CategoryService.findManyBy(filter, {
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
  async create(@Body() body: CreateA3CategoryDto): Promise<any> {
    const result = await this.a3CategoryService.create(body);

    return result;
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
    @Body() body: UpdateA3CategoryDto,
  ): Promise<any> {
    const result = await this.a3CategoryService.updateOneById(id, body);

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
    const result = await this.a3CategoryService.deleteManyHardByIds(
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
    const result = await this.a3CategoryService.deleteOneHardById(id);

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
    return this.a3CategoryService.paginate(query);
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
    @ApiQueryParams() { filter, population, projection }: AqpDto,
  ): Promise<any> {
    const result = await this.a3CategoryService.findOneById(id, {
      populate: population,
      projection,
    });

    if (!result) throw new NotFoundException('The item does not exist');

    return result;
  }
}

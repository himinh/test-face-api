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
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import ParseObjectIdPipe from '@pipe/parse-object-id.pipe';

import A3CharacterService from './a3-character.service';
import CreateA3CharacterDto from './dto/create-a3-character.dto';
import UpdateA3CharacterDto from './dto/update-a3-character.dto';
import { convertDataByLang } from '@helper/convert-data-lang';

@ApiTags('A3Characters')
@UseInterceptors(WrapResponseInterceptor)
@Controller()
export default class A3CharacterController {
  constructor(private readonly characterService: A3CharacterService) {}

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
    if (!options.sort?.categoryPosition) {
      Object.assign(options, {
        sort: {
          categoryPosition: 1,
          ...options.sort,
        },
      });
    }

    const result = await this.characterService.findManyBy(filter, {
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
  @Post('')
  @HttpCode(201)
  async create(@Body() body: CreateA3CharacterDto): Promise<any> {
    const result = await this.characterService.create(body);

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
    @Body() body: UpdateA3CharacterDto,
  ): Promise<any> {
    const result = await this.characterService.updateOneById(id, body);

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
    const result = await this.characterService.deleteManyHardByIds(
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
    const result = await this.characterService.deleteOneHardById(id);

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
    if (!query.sort?.categoryPosition) {
      Object.assign(query, {
        sort: {
          categoryPosition: 1,
          ...query.sort,
        },
      });
    }

    const result = await this.characterService.paginate(query);

    return result;
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
    const result = await this.characterService.findOneById(id, { populate });

    if (!result) throw new NotFoundException('The item does not exist');

    return result;
  }
}

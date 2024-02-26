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
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import ParseObjectIdPipe from '@pipe/parse-object-id.pipe';

import CreateA3MessageDto from './dto/create-a3-message.dto';
import UpdateA3MessageDto from './dto/update-a3-message.dto';
import A3MessageService from './a3-message.service';
import SettingService from '@common/c13-setting/setting.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { editFileName } from '@lazy-module/storage/storage.helper';
import StorageService from '@lazy-module/storage/storage.service';
import { unlinkSync } from 'fs';
import { GetCurrentUserId } from '@decorator/get-current-user-id.decorator';

@ApiTags('A3Messages')
@UseInterceptors(WrapResponseInterceptor)
@Controller()
export default class A3MessageController {
  constructor(
    private readonly a3MessageService: A3MessageService,
    private readonly settingService: SettingService,
    private readonly storageService: StorageService,
  ) {}

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
    const result = await this.a3MessageService.findManyBy(filter, {
      populate: population,
      ...options,
    });
    return result;
  }

  /**
   * convert image to text
   *
   * @param body
   * @returns
   */
  @Post('/upload-image-to-text')
  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', '..', '..', '..', 'public'),
        filename: editFileName,
      }),
    }),
  )
  async convertImageToText(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    const { fileUrl } = await this.storageService.uploadFile(file.path);

    const text = await this.settingService.convertImageToText(fileUrl);

    unlinkSync(file.path);

    return { text, fileUrl };
  }

  /**
   * Document to text
   *
   * @param body
   * @returns
   */
  @Post('/upload-file-to-text')
  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', '..', '..', '..', 'public'),
        filename: editFileName,
      }),
    }),
  )
  async convertDocumentToText(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    const text = await this.settingService.convertDocumentToText(file);

    const { fileUrl } = await this.storageService.uploadFile(file.path);

    unlinkSync(file.path);

    return { text, fileUrl };
  }

  /**
   * Create
   *
   * @param body
   * @returns
   */
  @Post('')
  @HttpCode(201)
  async create(@Body() body: CreateA3MessageDto): Promise<any> {
    return this.a3MessageService.createA3Message(body);
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
    @Body() body: UpdateA3MessageDto,
  ): Promise<any> {
    const result = await this.a3MessageService.updateOneById(id, body);

    return result;
  }

  /**
   * Clear conversations
   *
   * @param ids
   * @returns
   */
  @Delete(':conversationId/clear-conversation')
  @HttpCode(200)
  async clearConversations(@Param('conversationId') conversationId: string) {
    return this.a3MessageService.clearConversation(conversationId);
  }

  /**
   * Clear conversations
   *
   * @param ids
   * @returns
   */
  @Delete('clear/:characterId/character/:userId/user')
  @HttpCode(200)
  async clearMessageByCharacter(
    @Param('characterId') characterId: string,
    @Param('userId') userId: string,
  ) {
    return this.a3MessageService.deleteManyHard({
      characterId,
      userId,
    });
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
    const result = await this.a3MessageService.deleteManyHardByIds(
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
    const result = await this.a3MessageService.deleteOneHardById(id);

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
    return this.a3MessageService.paginate(query);
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
    const result = await this.a3MessageService.findOneById(id, {
      populate: population,
      projection,
    });

    if (!result) throw new NotFoundException('The item does not exist');

    return result;
  }
}

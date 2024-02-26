import { ImageAnnotatorClient } from '@google-cloud/vision';
import BaseService from '@base-inherit/base.service';
import CustomLoggerService from '@lazy-module/logger/logger.service';
import { Injectable } from '@nestjs/common';

import { SettingDocument } from './schemas/setting.schema';
import SettingRepository from './setting.repository';
import { HttpClientService } from '@lazy-module/http-client/http-client.service';
import pdf from 'pdf-parse';
const reader = require('any-text');

@Injectable()
export default class SettingService extends BaseService<SettingDocument> {
  constructor(
    readonly logger: CustomLoggerService,
    readonly settingRepository: SettingRepository,
    readonly httpClientService: HttpClientService,
  ) {
    super(logger, settingRepository);
  }

  async convertDocumentToText(file: Express.Multer.File) {
    const res = await reader.getText(file.path);

    return res || '';
  }

  async convertImageToText(imagePath: string) {
    // set google-cloud/vision
    const visionClient = new ImageAnnotatorClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });

    // get data image path
    const response = await this.httpClientService.get(imagePath, {
      responseType: 'arraybuffer',
    });

    const imageBuffer = Buffer.from(response.data);

    // get data with google-cloud/vision
    const [result] = await visionClient.textDetection(imageBuffer);
    const annotations = result.textAnnotations;

    if (annotations && annotations.length > 0) {
      return annotations[0].description;
    }

    return '';
  }
}

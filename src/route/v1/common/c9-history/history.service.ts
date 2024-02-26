import BaseService from '@base-inherit/base.service';
import CustomLoggerService from '@lazy-module/logger/logger.service';
import { Injectable } from '@nestjs/common';

import HistoryRepository from './history.repository';
import { HistoryDocument } from './schemas/history.schema';

@Injectable()
export default class HistoryService extends BaseService<HistoryDocument> {
  constructor(
    readonly logger: CustomLoggerService,
    readonly historyRepository: HistoryRepository,
  ) {
    super(logger, historyRepository);
  }

  /**
   *removeOldData
   * @returns
   */
  async removeOldData(): Promise<any> {
    const currentDate = new Date();
    const fifteenDaysAgo = new Date(currentDate);
    fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15); // 15 ngày
    const result = await this.historyRepository.deleteManyHard({
      createdAt: { $lt: new Date(fifteenDaysAgo) },
    });
    return result;
  }
}

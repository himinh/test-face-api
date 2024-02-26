import BaseService from '@base-inherit/base.service';
import CustomLoggerService from '@lazy-module/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { A3DiyDocument } from './schemas/a3-diy.schema';
import A3DiyRepository from './a3-diy.repository';
@Injectable()
export default class A3DiyService extends BaseService<A3DiyDocument> {
  constructor(
    readonly logger: CustomLoggerService,
    readonly a3DiyRepository: A3DiyRepository,
  ) {
    super(logger, a3DiyRepository);
  }

  async addAppDiyToUser(userId: string) {
    const diy = await this.a3DiyRepository.findOneBy({
      isAppDiy: true,
      userId,
    });

    if (diy) return;

    const userDiy = await this.findManyBy({ isCreatedByAdmin: true });

    return this.a3DiyRepository.create(
      userDiy.map((d: any) => ({
        userId,
        isAppDiy: true,
        avatar: d.avatar,
        description: d.description,
        name: d.name,
        firstMessage: d.firstMessage || 'Hi!',
        isCreatedByAdmin: false,
      })),
    );
  }
}

import BaseService from '@base-inherit/base.service';
import CustomLoggerService from '@lazy-module/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { A3CharacterDocument } from './schemas/a3-character.schema';
import A3CharacterRepository from './a3-character.repository';

@Injectable()
export default class A3CharacterService extends BaseService<A3CharacterDocument> {
  constructor(
    readonly logger: CustomLoggerService,
    readonly characterRepository: A3CharacterRepository,
  ) {
    super(logger, characterRepository);
  }
  async increaseCountMessages(characterId: string, count = 1) {
    return this.characterRepository.updateOneById(characterId, {
      $inc: {
        countMessages: count,
      },
    });
  }
}

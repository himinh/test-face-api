import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { A3Character, A3CharacterSchema } from './schemas/a3-character.schema';
import A3CharacterController from './a3-character.controller';
import A3CharacterRepository from './a3-character.repository';
import A3CharacterService from './a3-character.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: A3Character.name,
        schema: A3CharacterSchema,
      },
    ]),
  ],
  controllers: [A3CharacterController],
  providers: [A3CharacterService, A3CharacterRepository],
  exports: [A3CharacterService, A3CharacterRepository],
})
export default class A3CharacterModule {}

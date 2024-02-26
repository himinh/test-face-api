import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { A3Diy, A3DiySchema } from './schemas/a3-diy.schema';
import A3DiyController from './a3-diy.controller';
import A3DiyRepository from './a3-diy.repository';
import A3DiyService from './a3-diy.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: A3Diy.name,
        schema: A3DiySchema,
      },
    ]),
  ],
  controllers: [A3DiyController],
  providers: [A3DiyService, A3DiyRepository],
  exports: [A3DiyService, A3DiyRepository],
})
export default class A3DiyModule {}

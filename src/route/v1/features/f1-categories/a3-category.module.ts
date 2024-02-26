import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { A3Category, A3CategorySchema } from './schemas/a3-category.schema';
import A3CategoryController from './a3-category.controller';
import A3CategoryRepository from './a3-category.repository';
import A3CategoryService from './a3-category.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: A3Category.name,
        schema: A3CategorySchema,
      },
    ]),
  ],
  controllers: [A3CategoryController],
  providers: [A3CategoryService, A3CategoryRepository],
  exports: [A3CategoryService, A3CategoryRepository],
})
export default class A3CategoryModule {}

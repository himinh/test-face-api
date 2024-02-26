import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { A3Feedback, A3FeedbackSchema } from './schemas/a3-feedback.schema';
import A3FeedbackController from './a3-feedback.controller';
import A3FeedbackRepository from './a3-feedback.repository';
import A3FeedbackService from './a3-feedback.service';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: A3Feedback.name,
        schema: A3FeedbackSchema,
      },
    ]),
  ],
  controllers: [A3FeedbackController],
  providers: [A3FeedbackService, A3FeedbackRepository],
  exports: [A3FeedbackService, A3FeedbackRepository],
})
export default class A3FeedbackModule {}

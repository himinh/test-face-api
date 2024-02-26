import OtpModule from '@common/c2-otp/otp.module';
import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import HttpClientModule from '@lazy-module/http-client/http-client.module';
import FcmUserService from './fcm/fcm-user.service';
import UserController from './user.controller';
import UserRepository from './user.repository';
import UserService from './user.service';
import { User, UserSchema } from './schemas/user.schema';
import A3DiyModule from '../../features/f5-diy/a3-diy.module';

@Global()
@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;

          // eslint-disable-next-line
          schema.plugin(require('mongoose-slug-updater'));

          return schema;
        },
      },
    ]),
    OtpModule,
    HttpClientModule,
    A3DiyModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, FcmUserService],
  exports: [UserService, UserRepository, FcmUserService],
})
export default class UserModule {}

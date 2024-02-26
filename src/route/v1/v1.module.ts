import { RouterModule, Routes } from 'nest-router';

import FreeApiModule from '@authorization/a2-free-api/free-api.module';
import AuthUserAccessModule from '@authorization/a3-auth-user-access/auth-user-access.module';
import AuthUserIdModule from '@authorization/a4-auth-user-id/auth-user-id.module';
import GroupModule from '@authorization/a5-group/group.module';
import GroupDetailModule from '@authorization/a6-group-detail/group-detail.module';
import GroupApiModule from '@authorization/a7-group-api/group-api.module';
import BackupDataModule from '@common/c0-backup/backup-data.module';
import DashboardModule from '@common/c10-dashboard/dashboard.module';
import TransactionModule from '@common/c11-transaction/transaction.module';
import NotificationModule from '@common/c12-notification/notification.module';
import SettingModule from '@common/c13-setting/setting.module';
import OtpModule from '@common/c2-otp/otp.module';
import HistoryModule from '@common/c9-history/history.module';

import RolesGuard from '@guard/roles.guard';
import { ShareFunction } from '@helper/static-function';
import { Module } from '@nestjs/common';

import { SeedModule } from '@common/c14-seed/seed.module';
import VillageModule from './common/c8-village/village.module';
import DistrictModule from './common/c7-district/district.module';
import ProvinceModule from './common/c6-province/province.module';
import StaticS3Module from './common/c5-static-s3/static-s3.module';
import FileManagerModule from './common/c4-file-manager/file-manager.module';
import UploadModule from './common/c3-upload/upload.module';
import AuthModule from './common/c1-auth/auth.module';
import UserModule from './authorization/a1-user/user.module';
import A3CategoryModule from './features/f1-categories/a3-category.module';
import A3CharacterModule from './features/f2-characters/a3-character.module';
import A3MessageModule from './features/f3-messages/a3-message.module';
import A3ConversationModule from './features/f4-conversations/a3-conversation.module';
import A3DiyModule from './features/f5-diy/a3-diy.module';
import A3DiyMessageModule from './features/f6-diy-message/a3-diy-message.module';
import A3ToolCategoryModule from './features/f7-tool-categories/a3-tool-category.module';
import A3FeedbackModule from './features/f8-feedback/a3-feedback.module';

const routes: Routes = [
  {
    path: '/v1',
    children: [
      // Authorizations
      { path: '/users', module: UserModule },
      { path: '/free-apis', module: FreeApiModule },
      { path: '/auth-user-accesses', module: AuthUserAccessModule },
      { path: '/auth-user-ids', module: AuthUserIdModule },
      { path: '/groups', module: GroupModule },
      { path: '/group-details', module: GroupDetailModule },
      { path: '/group-apis', module: GroupApiModule },

      // Seed
      // { path: '/seeds', module: SeedModule },

      // Commons
      { path: '/backup-datas', module: BackupDataModule },
      { path: '/auth', module: AuthModule },
      { path: '/otps', module: OtpModule },
      { path: '/uploads', module: UploadModule },
      { path: '/file-manager', module: FileManagerModule },
      { path: '/provinces', module: ProvinceModule },
      { path: '/districts', module: DistrictModule },
      { path: '/villages', module: VillageModule },
      { path: '/histories', module: HistoryModule },
      { path: '/dashboards', module: DashboardModule },
      { path: '/transactions', module: TransactionModule },
      { path: '/notifications', module: NotificationModule },
      { path: '/settings', module: SettingModule },

      // Features
      { path: '/a3-categories', module: A3CategoryModule },
      { path: '/a3-characters', module: A3CharacterModule },
      { path: '/a3-messages', module: A3MessageModule },
      { path: '/a3-conversations', module: A3ConversationModule },
      { path: '/a3-diy', module: A3DiyModule },
      { path: '/a3-diy-messages', module: A3DiyMessageModule },
      { path: '/a3-tool-categories', module: A3ToolCategoryModule },

      //feedback
      { path: '/a3-feedbacks', module: A3FeedbackModule },
    ],
  },
];

if (ShareFunction.checkIsConfigS3Storage()) {
  /* eslint no-console: 0 */
  console.log('*** Replace serve static via router static with s3 storage ***');
  routes.push({ path: '/static', module: StaticS3Module });
}
const imports = [
  RouterModule.forRoutes(routes),

  // authorization
  UserModule,
  FreeApiModule,
  AuthUserAccessModule,
  AuthUserIdModule,
  GroupModule,
  GroupDetailModule,
  GroupApiModule,
  RolesGuard,

  // Seed
  SeedModule,

  // common
  BackupDataModule,
  AuthModule,
  OtpModule,
  UploadModule,
  FileManagerModule,
  ProvinceModule,
  DistrictModule,
  VillageModule,
  HistoryModule,
  DashboardModule,
  NotificationModule,
  SettingModule,

  // features
  A3CategoryModule,
  A3CharacterModule,
  A3MessageModule,
  A3ConversationModule,
  A3DiyModule,
  A3DiyMessageModule,
  A3ToolCategoryModule,

  //feedback
  A3FeedbackModule,
];

if (ShareFunction.checkIsConfigS3Storage()) {
  /* eslint no-console: 0 */
  console.log('*** Import module S3Storage dynamic ***');
  imports.push(StaticS3Module);
}

@Module({
  imports,
})
export default class V1Module {}

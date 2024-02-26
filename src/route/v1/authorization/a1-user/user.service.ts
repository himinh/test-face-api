import { QueryOptions, Types } from 'mongoose';

import { UserDocument } from '@authorization/a1-user/schemas/user.schema';
import GroupService from '@authorization/a5-group/group.service';
import GroupDetailService from '@authorization/a6-group-detail/group-detail.service';
import GroupApiService from '@authorization/a7-group-api/group-api.service';
import BaseService from '@base-inherit/base.service';
import OtpService from '@common/c2-otp/otp.service';
import { adminConstants } from '@constant/admin.constants';
import CustomLoggerService from '@lazy-module/logger/logger.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import CreateUserDto from './dto/create-user.dto';
import { UpdateRolesDto } from './dto/update-roles.dto';
import UpdateUserDto from './dto/update-user.dto';
import { ValidateUserDto } from './dto/validate-user.dto';
import UserRepository from './user.repository';
import A3DiyService from '../../features/f5-diy/a3-diy.service';

@Injectable()
export default class UserService extends BaseService<UserDocument> {
  constructor(
    readonly logger: CustomLoggerService,
    readonly userRepository: UserRepository,
    readonly otpService: OtpService,
    readonly groupDetailService: GroupDetailService,
    readonly groupService: GroupService,
    readonly groupApiService: GroupApiService,
    readonly a3DiyService: A3DiyService,
  ) {
    super(logger, userRepository);
  }

  /*
    Get system account
  */
  async getSystemAccount(): Promise<any> {
    const userFilter = {
      email: { $in: ['admin@gmail.com', 'system@gmail.com'] },
    };
    const userOptions = { projection: { _id: 1, fullName: 1 } };

    return this.userRepository.findOneBy(userFilter, userOptions);
  }

  /**
   * Validate user
   * @param data
   * @returns
   */
  async validateUser(data: ValidateUserDto) {
    const { phone, socialKey, email, userName } = data;
    // Check phone exist
    if (phone) {
      const userExists = await this.userRepository.findByPhone(phone);
      if (userExists) return userExists;
    }

    // check socialKey exist
    if (socialKey) {
      const userExists = await this.userRepository.findByTokenLogin(socialKey);

      if (userExists) return userExists;
    }

    // check email exist
    if (email) {
      const userExists = await this.userRepository.findOneBy({ email });

      if (userExists) return userExists;
    }

    // check userName exist
    if (userName) {
      const userExists = await this.userRepository.findOneBy({ userName });

      if (userExists) return userExists;
    }

    return null;
  }

  /**
   * Create user
   * @param user
   * @returns
   */
  async create(user: CreateUserDto): Promise<UserDocument> {
    const { phone, email } = user;
    // validate user
    const userExist = await this.validateUser({ phone, email });

    if (userExist && !userExist.isDeleted) {
      throw new BadRequestException(
        'The account already exists in the system.',
      );
    }

    if (userExist && userExist.isDeleted) {
      const userUpdated = this.userRepository.updateOneById(userExist._id, {
        deleted: false,
      });

      return (<unknown>userUpdated) as UserDocument;
    }
    const result = await this.userRepository.create(user);
    await this.a3DiyService.addAppDiyToUser(result._id.toString());
    return result;
  }

  /**
   * Update one by id
   * @param id
   * @param data
   * @param options
   * @returns
   */
  async updateRolesById(
    id: Types.ObjectId,
    data: UpdateRolesDto,
    options = <any>{ new: true },
  ): Promise<UserDocument> {
    const user = await this.userRepository.updateOneById(id, data, options);

    if (!user) throw new NotFoundException('User not found.');

    return user;
  }

  /**
   * Update one by id
   * @param id
   * @param data
   * @param options
   * @returns
   */
  async updateOneById(
    id: Types.ObjectId | string,
    data: UpdateUserDto | any,
    options: any = { new: true },
  ): Promise<UserDocument> {
    const { phone, email } = data;

    // validate user
    const userExist = await this.validateUser({ phone, email });

    if (userExist)
      throw new BadRequestException('phone/email/socialKey already exist.');

    const user = await this.userRepository.updateOneById(id, data, options);

    if (!user) throw new NotFoundException('User not found.');

    return user;
  }

  /**
   * Update one by id
   * @param id
   * @param groupId
   * @returns
   */
  async updateGroup(
    id: Types.ObjectId,
    groupId: Types.ObjectId,
    options: '$addToSet' | '$pull',
  ) {
    return this.userRepository.updateOneById(
      id,
      {
        [options]: { groups: groupId },
      },
      { new: true },
    );
  }

  /**
   * Find one by id
   * @param id
   * @param options
   * @returns
   */
  async findOneById(
    id: Types.ObjectId | any,
    options: QueryOptions = {},
  ): Promise<UserDocument | null> {
    return this.userRepository.findOneById(id, options);
  }

  /**
   * Find one by id and return type any
   * @param id
   * @param options
   * @returns
   */
  async findOneByIdAny(
    id: Types.ObjectId,
    options: QueryOptions = {},
  ): Promise<any> {
    return this.userRepository.findOneById(id, options);
  }

  /**
   * Add device ID
   * @param id
   * @param deviceID
   * @returns
   */
  async addDeviceID(
    id: Types.ObjectId,
    deviceID: string,
  ): Promise<UserDocument | null> {
    const updateData = { deviceID, $addToSet: { fcmTokens: deviceID } };

    return this.userRepository.updateOneById(id, updateData);
  }

  /**
   * Remove device ID
   * @param id
   * @param deviceID
   * @returns
   */
  async removeDeviceID(id: Types.ObjectId, deviceID: string) {
    const updateData = { deviceID: '', $pull: { fcmTokens: deviceID } };

    const user = await this.userRepository.updateOneById(id, updateData);

    // if fcmTokens includes "DeviceID" => update: deviceID = user.fcmTokens[0]
    if (user?.fcmTokens.includes(deviceID)) {
      await this.userRepository.updateOneById(user._id, {
        deviceID: user.fcmTokens[0] || '',
      });
    }

    return user;
  }

  /**
   * Rest authorization
   *
   * @param router
   * @returns
   */
  async resetAuthorization(router: any) {
    // Reset all authorizations
    await Promise.all([
      this._resetGroupApis(router),
      this._resetGroupDetails(router),
    ]);

    // Create admin have all permissions
    return this._createAdmin();
  }

  /**
   * Create admin account
   * @returns
   */
  private async _createAdmin() {
    const adminItem = adminConstants;

    // Update account admin
    const [groupDetailsDoc, adminUser] = await Promise.all([
      this.groupDetailService.findManyBy({}),
      this.userRepository.findOneBy({ email: adminItem.email }),
    ]);

    // get groupDetails items
    const groupDetails = groupDetailsDoc.map((groupDetail: any) => {
      return {
        idGroupDetail: groupDetail._id,
        accessMethods: ['GET', 'POST', 'PUT', 'DELETE'],
      };
    });

    // If admin exist => update
    if (adminUser) {
      return this.userRepository.updateOneById(adminUser._id, {
        groupDetails,
      });
    }

    // create new
    return this.userRepository.create({ ...adminItem, groupDetails });
  }

  /**
   * Reset group details
   * @param router
   */
  private async _resetGroupDetails(router: any) {
    // reset group details
    await this.groupDetailService.resetGroupDetails(router);

    // update groupDetails of user and groups.
    await Promise.all([
      this.userRepository.updateManyBy({}, { groupDetails: [] }),
      this.groupService.updateManyBy({}, { groupDetails: [] }),
    ]);
  }

  /**
   * Reset group apis
   * @param router
   */
  private async _resetGroupApis(router: any) {
    await this.groupApiService.resetGroupApis(router);

    const updateItems = { groupAPIAccesses: [], groupAPIDenines: [] };

    await Promise.all([
      this.userRepository.updateManyBy({}, updateItems),
      this.groupService.updateManyBy({}, updateItems),
    ]);
  }

  /**
   * Auto reset authorization and seed an account
   */
  async seedAdminAndResetAuthorization(router: any) {
    await this._resetGroupDetails(router);
    const admin = await this._createAdmin();
    this.logger.log('CREATE ACCOUNT ADMIN SUCCESSFULLY!');
    this.logger.log('Account admin: ', { email: admin?.email });
    this.logger.log('Total collections: ', admin?.groupDetails?.length);
  }

  async increaseCountMessages(userId: any, count = 1) {
    return this.userRepository.updateOneById(userId, {
      $inc: {
        countMessages: count,
        aiCountFreeMessages: -count,
      },
    });
  }

  async increaseCountAskMessages(userId: any, count = 1) {
    return this.userRepository.updateOneById(userId, {
      $inc: {
        countAskMessages: count,
      },
    });
  }

  async increaseAICountFreeMessage(userId: any, count = 1) {
    return this.userRepository.updateOneById(userId, {
      $inc: {
        aiCountFreeMessages: count,
      },
    });
  }
}

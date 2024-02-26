import { PaginateModel, QueryOptions, Types, UpdateQuery } from 'mongoose';

import { User, UserDocument } from '@authorization/a1-user/schemas/user.schema';
import BaseRepository from '@base-inherit/base.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { verify } from 'argon2';
import { ObjectId } from 'mongodb';

@Injectable()
export default class UserRepository extends BaseRepository<UserDocument> {
  private userModel: PaginateModel<UserDocument>;

  constructor(@InjectModel(User.name) userModel: PaginateModel<UserDocument>) {
    super(userModel);
    this.userModel = userModel;
  }

  /**
   * aggregate
   * @param user
   * @returns
   */
  public async aggregate(query: any[]): Promise<any[]> {
    return this.userModel.aggregate(query);
  }

  /**
   * Create
   * @param user
   * @returns
   */
  public async create(user: any): Promise<UserDocument> {
    return this.userModel.create(user);
  }

  /**
   * Update password
   * @param data
   * @returns
   */

  public async updatePassword(filter = {}, password: string) {
    const user = await this.userModel.findOne(filter);

    if (!user) throw new NotFoundException('User not found.');

    user.password = password;
    return user.save();
  }

  /**
   * Find one by id
   * @param id
   * @param options
   * @returns
   */
  public async findOneById(
    id: ObjectId | string,
    options: QueryOptions = {},
  ): Promise<UserDocument | null> {
    return this.userModel.findById(id, options.projection, options);
  }

  /**
   * Find one by
   * @param query
   * @param options
   * @returns
   */
  public async findOneBy(
    query = {},
    options: QueryOptions = {},
  ): Promise<UserDocument | null> {
    return this.userModel.findOne(query, options?.projection, options);
  }

  /** bcrypt
   * Find one by ids
   * @param ids
   * @returns
   */
  public async findOneByIds(ids: Types.ObjectId[]): Promise<UserDocument[]> {
    return this.userModel.find({ _id: { $in: ids } }).lean();
  }

  /**
   * Find by phone
   * @param phone
   * @returns
   */
  public async findByPhone(phone: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ phone });
  }

  /**
   * Find by tokenLogin
   * @param tokenLogin
   * @returns
   */
  public async findByTokenLogin(
    tokenLogin: string,
  ): Promise<UserDocument | null> {
    return this.userModel.findOne({ tokenLogin }).lean();
  }

  /**
   * Update fcmTokes
   * @param id
   * @param fcmTokens
   * @returns
   */
  public async updateFcmTokensById(id: Types.ObjectId, fcmTokens: string[]) {
    return this.userModel.findByIdAndUpdate(id, { fcmTokens }, { new: true });
  }

  /**
   * Update one by id
   * @param id
   * @param data
   * @param options
   * @returns
   */
  public async updateOneById(
    id: Types.ObjectId | ObjectId | String,
    data: any,
    options: any = { new: true },
  ): Promise<UserDocument | null> {
    const result = (await this.userModel.findByIdAndUpdate(
      id,
      data as UpdateQuery<UserDocument>,
      options,
    )) as unknown as UserDocument;

    // check user
    if (!result) throw new NotFoundException('User not found.');

    return result;
  }

  async checkPasswordById(idUser: ObjectId, plainPassword: string) {
    const user = await this.findOneById(idUser, {
      projection: { password: 1 },
    });

    return this.comparePassword(user!.password, plainPassword);
  }

  async comparePassword(hashPassword: string, plainPassword: string) {
    return verify(hashPassword, plainPassword);
  }
}

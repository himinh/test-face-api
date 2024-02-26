import { PaginateModel } from 'mongoose';

import BaseRepository from '@base-inherit/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Transaction, TransactionDocument } from './schemas/transaction.schema';

@Injectable()
export default class TransactionRepository extends BaseRepository<TransactionDocument> {
  private transactionModel;

  constructor(
    @InjectModel(Transaction.name) model: PaginateModel<TransactionDocument>,
  ) {
    super(model);
    this.transactionModel = model;
  }

  /**
   * Create transactions
   *
   * @param item
   * @returns
   */
  async createMany(item: any[]) {
    return this.transactionModel.create(item);
  }
}

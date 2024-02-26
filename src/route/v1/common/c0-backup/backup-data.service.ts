/* eslint-disable */
import dayjs from 'dayjs';
import fs, { existsSync } from 'fs';
import {
  LocalFileSystemDuplexConnector,
  MongoDBDuplexConnector,
  MongoTransferer,
} from 'mongodb-snapshot';
import { Types } from 'mongoose';
import { getConnectionDb } from 'src/util/database/getConnectionDB';

import BaseService from '@base-inherit/base.service';
import CustomLoggerService from '@lazy-module/logger/logger.service';
import {
  BadRequestException,
  ConsoleLogger,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { backupDataConstants } from './backup-data.constants';
import BackupDataRepository from './backup-data.repository';
import { BackupDataDocument } from './schemas/backup-data.schema';
import S3Service from '@lazy-module/s3/s3.service';
var JSONStream = require('JSONStream');
import * as stream from 'stream';
import { MongoClient } from 'mongodb';
import AWS from 'aws-sdk';


@Injectable()
export default class BackupDataService extends BaseService<BackupDataDocument> {
  folderStore = backupDataConstants.FOLDER_STORE;

  backupName = process.env.DATABASE_NAME;

  currentTime = dayjs().format('YYYY-MM-DDTHH:mm:ss');

  backupFile = `${this.folderStore}/${this.currentTime}-${this.backupName}.gz`;

  constructor(
    readonly logger: CustomLoggerService,
    readonly backupDataRepository: BackupDataRepository,
    private s3Service: S3Service
  ) {
    super(logger, backupDataRepository);
  }

  /**
   * Backup file
   */
  public async backup() {
    return this.backupPromise()
      .catch((error) => {
        throw new BadRequestException(error);
      })
      .then((message) => message);
  }

  /**
   * restore Master data
   */
  public async restoreMaster() {
    return this.restoreMasterPromise('public/backup/masterbackup.tar')
      .catch((error) => {
        throw new BadRequestException(error);
      })
      .then((message) => message);
  }

  /**
   * Restore backup data
   */
  public async restore(id: Types.ObjectId) {
    const backupDoc = await this.backupDataRepository.findOneById(id);

    if (!backupDoc) throw new NotFoundException('Backup file not found');

    return this.restorePromise(backupDoc.path)
      .catch((error) => {
        throw new BadRequestException(error);
      })
      .then((message) => message);
  }

  /**
   *
   */
  private initBackup(pathLocal: string, isBackup = true) {
    // Mongo connector
    const mongoConnector = new MongoDBDuplexConnector({
      connection: {
        uri: `${process.env.MONGODB_URL as string}`,
        dbname: `${process.env.DATABASE_NAME as string}`,
        isAtlasFreeTier: true,
      },
    });

    // Localfile connector
    const localFileConnector = new LocalFileSystemDuplexConnector({
      connection: {
        path: pathLocal,
      },
    });

    // Transferer
    if (isBackup) {
      return new MongoTransferer({
        source: mongoConnector,
        targets: [localFileConnector],
      });
    }

    // Restore
    return new MongoTransferer({
      source: localFileConnector,
      targets: [mongoConnector],
    });
  }

  /**
   * backup promise
   * @returns
   */
  private async backupPromise() {
    // update time
    this.currentTime = dayjs().format('YYYY-MM-DDTHH:mm:ss');
    this.backupFile = `${this.folderStore}/${this.currentTime}-${this.backupName}.tar`;

    // init backup
    const transferer = this.initBackup(this.backupFile);

    // Processing
    // eslint-disable-next-line no-restricted-syntax
    for await (const { total, write } of transferer) {
      console.log(`remaining bytes to write: ${total - write}`);
    }

    // remove old
    await this.removeOldBackupFiles(30);

    // store backup file
    await this.backupDataRepository.create({
      path: this.backupFile,
    });

    this.logger.log(
      'Backup SUCCESS',
      `Backup is successfull at ${this.currentTime}`,
    );

    return { status: true };
  }

  /**
   * Restore promise
   * @param path
   * @returns
   */
  private async restoreMasterPromise(pathLocal: string) {
    // check file exists
    if (existsSync(pathLocal)) {
      // Delete all database before backup
      const database = getConnectionDb();
      const collections = await database.listCollections();

      // eslint-disable-next-line no-restricted-syntax
      for await (const collection of collections) {
        console.log(`Dropping ${collection.name}`);
        await database.collection(collection.name).drop();
      }

      // init backup
      const transferer = this.initBackup(pathLocal, false);

      // Processing
      // eslint-disable-next-line no-restricted-syntax
      for await (const { total, write } of transferer) {
        console.log(`remaining bytes to write: ${total - write}`);
      }

      this.logger.log(
        'Restore SUCCESS',
        `Restore is successfull at ${this.currentTime}`,
      );

      return { status: true };
    }

    return { status: false, message: 'File not exists' };
  }

  /**
   * Restore promise
   * @param path
   * @returns
   */
  private async restorePromise(pathLocal: string) {
    // check file exists
    if (existsSync(pathLocal)) {
      // update time
      this.currentTime = dayjs().format('YYYY-MM-DDTHH:mm:ss');
      this.backupFile = `${this.folderStore}/${this.currentTime}-${this.backupName}.tar`;

      // Backup before restore
      await this.backupPromise();

      // Delete all database before backup
      const database = getConnectionDb();
      const collections = await database.listCollections();

      // update name database backupdatas to backupdatastemp
      await database.collection('backupdatas').rename('backupdatastemp');

      // eslint-disable-next-line no-restricted-syntax
      for await (const collection of collections) {
        if (collection.name !== 'backupdatastemp') {
          console.log(`Dropping ${collection.name}`);
          await database.collection(collection.name).drop();
        }
      }

      // init backup
      const transferer = this.initBackup(pathLocal, false);

      // Processing
      // eslint-disable-next-line no-restricted-syntax
      for await (const { total, write } of transferer) {
        console.log(`remaining bytes to write: ${total - write}`);
      }

      // update name database backupdatas to backupdatastemp
      database.collection('backupdatas').drop();
      database.collection('backupdatastemp').rename('backupdatas');

      this.logger.log(
        'Restore SUCCESS',
        `Restore is successfull at ${this.currentTime}`,
      );

      return { status: true };
    }

    return { status: false, message: 'File not exists' };
  }

  /**
   * Remove old backup files
   * @param ignoreLatestFile
   */
  private async removeOldBackupFiles(ignoreLatestFile = 10) {
    // get all files in "folderStore" and sort
    const files = fs.readdirSync(this.folderStore).sort();

    // ignore the latest files
    files.splice(-ignoreLatestFile);

    // remove
    files.forEach(async (file) => {
      const path = `${this.folderStore}/${file}`;

      await this.backupDataRepository.deleteOneHardBy({ path });

      fs.unlinkSync(path);
    });
  }

  public async backupDatabaseToS3() {
    const client = new MongoClient(process.env.MONGODB_URL!);
    await client.connect();

    const db = client.db(process.env.DATABASE_NAME);
    // storing the details of all collections in an array
    const collectionsArray = await db.listCollections().toArray();

    this.currentTime = dayjs().format('YYYY-MM-DDTHH:mm:ss');

    // storing the names of the collections separately
    let collectionNames: any = [];

    collectionsArray.forEach((item) => {
      collectionNames.push(item.name);
    });

    const bucketName = process.env.S3_BUCKET_BACKUP_NAME_PATH;

    const s3 = new AWS.S3({
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_ACCESS_KEY_SECRET,
      endpoint: process.env.S3_ENDPOINT
    });

    const uploadStream = (s3: AWS.S3, Bucket: string, Key: string) => {
      const passT = new stream.PassThrough();
      return {
        writeStream: passT,
        promise: s3.upload({ Bucket, Key, Body: passT }).promise(),
      };
    };

    // stroing all the promises in an array
    var promisesArray = [];

    //looping through all collections in the database
    for (const item of collectionNames) {
      // key consists of database name and timestamp at the time of uploading
      const key = `${this.currentTime}/${item}.json`;
      // creating a write stream for streaming data to Amazon S3
      const { writeStream, promise } = uploadStream(s3, bucketName!, key);

      /* 
      find() query returns a cursor(pointer) which points to the documents
      of the collection
     */
      const mongodbCursor = await db.collection(item).find({});
      /*
       piping data from the MongoDB cursor, through the JSON stringifier, and 
       finally into the write stream
     */
      mongodbCursor.stream().pipe(JSONStream.stringify()).pipe(writeStream);

      promisesArray.push(promise);
    }

    return Promise.all(promisesArray)
      .then(async (response) => {
        if (response.length > 0) {
          let paths = [];
          for (let i = 0; i < response.length; i++) {
            paths.push(response[i].Location);
          }
          await this.backupDataRepository.create({ name: this.currentTime, paths: paths });
        }
        this.deleteOldFolder();
        this.logger.log('Backup SUCCESS', `Backup is successfull at ${this.currentTime}`);
        return { status: true };
      })
      .catch((error) => {
        return `Error! Could not complete the database backup process. ${error}`;
      });
  }

  /**
   * deleteOldFolder
   * @returns
   */
  async deleteOldFolder() {
    const bucketPath = process.env.S3_BUCKET_BACKUP_NAME_PATH!;
    const bucket = `${bucketPath.split('/')[0]}`;
    const prefix = `${bucketPath.split('/')[1]}/backup/`;
    const listData = await this.s3Service?.getListFileFromS3(bucket, prefix);

    const currentDate = new Date();
    const thirtyDaysInMilliseconds = 30 * 24 * 60 * 60 * 1000; // 30 ngày 
    const promiseDeleteFileOlderThan1Days: any = [];

    if (listData) {
      listData.CommonPrefixes.forEach(async (folder: any) => {
        const folderName = folder.Prefix.split('/').slice(-2, -1)[0]; // Lấy phần cuối cùng của tên folder

        const folderTimestamp = Date.parse(folderName); // Chuyển đổi tên folder thành timestamp

        if (currentDate.getTime() - folderTimestamp >= thirtyDaysInMilliseconds) {
          const files = await this.s3Service?.getListFileFromS3(bucket, `${prefix}${folderName}/`);

          //set value delete
          this.backupDataRepository.deleteManyHard({ name: folderName });

          if (files) {
            for (let i = 0; i < files.Contents.length; i += 1) {
              promiseDeleteFileOlderThan1Days.push(this.s3Service.deleteFileFromS3(files.Contents[i].Key.split('/').pop(), `backup/${folderName}`));
            }
          }
        }
      });
      if (promiseDeleteFileOlderThan1Days.length > 0) {
        await Promise.all(promiseDeleteFileOlderThan1Days);
      }
    }
  }

}

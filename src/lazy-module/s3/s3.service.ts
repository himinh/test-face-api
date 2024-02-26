import * as AWS from 'aws-sdk';
import {
  CopyObjectRequest,
  DeleteObjectRequest,
  GetObjectRequest,
  HeadObjectRequest,
  ListObjectsV2Request,
  ManagedUpload,
  PutObjectRequest,
} from 'aws-sdk/clients/s3';
import { AWSError } from 'aws-sdk/lib/error';

import { ShareFunction } from '@helper/static-function';
import CustomLoggerService from '@lazy-module/logger/logger.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class S3Service {
  private awsS3: AWS.S3 | undefined;

  constructor(private logger: CustomLoggerService) {
    this.init();
  }

  init() {
    if (ShareFunction.isConfigS3()) {
      this.awsS3 = new AWS.S3({
        accessKeyId: ShareFunction.env().S3_ACCESS_KEY_ID,
        secretAccessKey: ShareFunction.env().S3_ACCESS_KEY_SECRET,
        region: ShareFunction.env().S3_REGION,
        endpoint: ShareFunction.env().S3_ENDPOINT,
        correctClockSkew: true,
      });
      this.logger.log('S3Module init success');
    } else {
      // eslint-disable-next-line max-len
      this.logger.warn(
        'STORAGE_SERVER, S3_ACCESS_KEY_ID, S3_ACCESS_KEY_SECRET, S3_REGION, S3_BUCKET_NAME_PATH was not found, S3Module module was not init',
      );
    }
  }

  public get() {
    return this.awsS3 ?? null;
  }

  async uploadFile(
    params: PutObjectRequest,
    options?: ManagedUpload.ManagedUploadOptions,
  ) {
    return new Promise((resolve, reject) => {
      return this.awsS3?.upload(params, options, (err, data) => {
        if (err) reject(new Error('File not found'));

        return resolve(data);
      });
    });
  }

  async getSignedUrl(operation: string, params: any) {
    return this.awsS3?.getSignedUrl(operation, params);
  }

  async getFile(params: GetObjectRequest) {
    return new Promise((resolve, reject) => {
      return this.awsS3?.getObject(params, (err, data) => {
        if (err) reject(new Error('File not found'));

        return resolve(data);
      });
    });
  }

  async getListFileFromS3(bucket: string, prefix: string): Promise<any> {
    const params = {
      Bucket: bucket,
      Prefix: prefix,
      Delimiter: '/',
    } as ListObjectsV2Request;
    return new Promise<any>((resolve, reject) => {
      this.awsS3?.listObjectsV2(params, (err: AWSError, data: any) => {
        if (err) reject(new Error('File not found'));
        resolve(data);
      });
    });
  }

  async getHeadFromS3(key: string): Promise<any> {
    const params = {
      Bucket: `${ShareFunction.env().S3_BUCKET_NAME_PATH}/tmp`,
      Key: key,
    } as HeadObjectRequest;

    return new Promise<any>((resolve, reject) => {
      this.awsS3?.headObject(params, (err: AWSError, data: any) => {
        if (err) reject(new Error('File not found'));
        resolve(data);
      });
    });
  }

  async getFileFromS3(key: string): Promise<any> {
    const arrayNameFile = key.split('/');
    const nameFile = arrayNameFile[arrayNameFile.length - 1];
    const params = {
      Bucket: `${ShareFunction.env().S3_BUCKET_NAME_PATH}/tmp`,
      Key: nameFile || key,
    } as GetObjectRequest;
    return new Promise<any>((resolve, reject) => {
      this.awsS3?.getObject(params, (err: AWSError, data: any) => {
        if (err) reject(new Error('File not found'));
        resolve(data);
      });
    });
  }

  async putObject(key: string, buffer: any[], pathFile?: string): Promise<any> {
    const pathStorageFile = pathFile
      ? `${ShareFunction.env().S3_BUCKET_NAME_PATH}/${pathFile}`
      : `${ShareFunction.env().S3_BUCKET_NAME_PATH}`;

    const params = {
      Bucket: pathStorageFile,
      Body: buffer,
      Key: key,
    } as GetObjectRequest;

    return new Promise((resolve, reject) => {
      return this.awsS3?.putObject(params, (err: AWSError, data: any) => {
        if (err) return reject(new Error(`Save file ${key} error`));

        return resolve(data);
      });
    });
  }

  async putFileFromS3(
    key: string,
    buffer: any[],
    pathFile?: string,
  ): Promise<any> {
    const pathStorageFile = pathFile
      ? `${ShareFunction.env().S3_BUCKET_NAME_PATH}/${pathFile}`
      : `${ShareFunction.env().S3_BUCKET_NAME_PATH}`;

    const params = {
      Bucket: pathStorageFile,
      Body: buffer,
      Key: key,
    } as GetObjectRequest;

    return new Promise<any>((resolve, reject) => {
      this.awsS3?.putObject(params, (err: AWSError, data: any) => {
        if (err) reject(new Error(`Save file ${key} error`));
        resolve(data);
      });
    });
  }

  async deleteFileFromS3(key: string, pathFile?: string): Promise<any> {
    const arrayNameFile = key.split('/');
    const nameFile = arrayNameFile[arrayNameFile.length - 1];
    const pathStorageFile = pathFile
      ? `${ShareFunction.env().S3_BUCKET_NAME_PATH}/${pathFile}`
      : `${ShareFunction.env().S3_BUCKET_NAME_PATH}`;

    const params = {
      Bucket: pathStorageFile,
      Key: nameFile,
    } as DeleteObjectRequest;
    /* eslint no-console: 0 */
    console.log('deleteFileFromS3', params);
    return new Promise<any>((resolve, reject) => {
      return this.awsS3?.deleteObject(params, (err: AWSError, data: any) => {
        if (err) return reject(new Error(`Delete file ${key} error`));

        return resolve(data);
      });
    });
  }

  async copyFileS3Storage(
    key: string,
    pathFile: string,
    newPathFile: string,
  ): Promise<any> {
    const pathStorageFile = ShareFunction.env().S3_BUCKET_NAME_PATH;

    const params = {
      Bucket: pathStorageFile,
      CopySource: `${pathStorageFile}/${pathFile}/${key}`,
      Key: `${newPathFile}/${key}`,
    } as CopyObjectRequest;
    return new Promise<any>((resolve, reject) => {
      this.awsS3?.copyObject(params, (err: AWSError, data: any) => {
        if (err) reject(new Error(`Copy file ${key} error`));
        resolve(data);
      });
    });
  }

  async moveFileS3Storage(
    key: string,
    pathFile: string,
    newPathFile: string,
  ): Promise<any> {
    const arrayNameFile = key.split('/');
    const nameFile = arrayNameFile[arrayNameFile.length - 1];
    await this.copyFileS3Storage(nameFile, pathFile, newPathFile);
    await this.deleteFileFromS3(nameFile, pathFile);
    return `${key.replace('tmp', `${newPathFile}`)}`;
  }

  async serveFileFromS3(req: any, res: any, urlKey: string): Promise<any> {
    const urlKeyInProject = urlKey.replace('/static/', '');
    const params = {
      Bucket: `${ShareFunction.env().S3_BUCKET_NAME_PATH}`,
      Key: urlKeyInProject,
    } as GetObjectRequest;
    this.awsS3
      ?.getObject(params)
      .createReadStream()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .on('error', (e) => {
        res.status(404).send();
      })
      .pipe(res);
  }
}

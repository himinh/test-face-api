import { ObjectId } from 'mongodb';

import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export default class ParseObjectIdPipe implements PipeTransform<any, string> {
  public transform(value: string): string {
    try {
      const _id = ObjectId.createFromHexString(value);

      return _id.toString();
    } catch (error) {
      throw new BadRequestException('Validation failed (ObjectId is expected)');
    }
  }
}

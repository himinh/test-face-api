import { ObjectId } from 'mongodb';

export type TokenPayload = {
  _id: ObjectId;
  role: string;
  email?: string;
  phone?: string;
  fullName?: string;
};

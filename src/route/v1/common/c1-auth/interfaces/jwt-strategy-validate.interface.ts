import { Types } from 'mongoose';

import { RoleUser } from '@enum/role-user.enum';

export interface JwtStrategyValidate {
  _id: Types.ObjectId;
  role: RoleUser;
}

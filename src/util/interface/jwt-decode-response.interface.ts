import { RoleUser } from '@enum/role-user.enum';

export interface JwtDecodeResponse {
  id: string;
  role: RoleUser;
  iat: number;
  exp: number;
}

import { AuthenticatedUser } from './user';

export interface LoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  refreshExpiresIn: number;
  user: AuthenticatedUser;
}

export interface RefreshResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  refreshExpiresIn: number;
}

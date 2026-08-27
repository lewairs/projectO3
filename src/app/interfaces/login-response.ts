import { AuthenticatedUser, BackendUser } from './user';

export interface BackendLoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: BackendUser;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: AuthenticatedUser;
}

import { AuthenticatedUser, BackendUser } from './user';

export interface BackendLoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  refreshExpiresIn?: number;
  user: BackendUser;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  refreshExpiresIn?: number;
  user: AuthenticatedUser;
}

export interface RefreshTokenResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
}

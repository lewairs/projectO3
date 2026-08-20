import { User} from './user'
export interface LoginResponse {
  accessToken: string;
  tokenType:'Bearer';
  expiresIn: number;
  user: User;
}
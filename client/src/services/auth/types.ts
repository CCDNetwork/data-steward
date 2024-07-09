import { Organization } from '@/services/organizations';
import { User } from '@/services/users';

export interface AuthData {
  token: string;
  user: User;
  organization: Organization;
}

export interface LoginRequest {
  username: string;
  password: string;
}

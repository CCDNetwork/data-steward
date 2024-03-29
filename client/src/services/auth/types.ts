import { Tenant } from '@/services/tenants';
import { User } from '@/services/users';

export interface AuthData {
  token: string;
  user: User;
  tenant: Tenant;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation?: string;
}

export interface ResetPasswordRequest {
  email: string;
  passwordResetCode: string;
  password: string;
  passwordConfirmation: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ActivateAccountRequest {
  email: string;
  activationCode: string;
}

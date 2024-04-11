import { User } from '@/services/users';

export enum UserRole {
  Owner = 'owner',
  User = 'user',
  Admin = 'admin',
}

export const initialUser: User = {
  id: '',
  email: '',
  firstName: '',
  lastName: '',
  activatedAt: null,
  createdAt: null,
  role: '',
};

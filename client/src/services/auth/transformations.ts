import { initialUser, resToUser } from '@/services/users';
import { resToTenant } from '@/services/tenants';

import { AuthData } from './types';

export const resToAuthData = (res: any): AuthData => {
  return {
    token: res.token,
    user: res.user ? resToUser(res.user) : initialUser,
    tenant: resToTenant(res.tenants[0]),
  };
};

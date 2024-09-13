import { initialUser, resToUser } from '@/services/users';
import {
  initialOrganization,
  resToOrganization,
} from '@/services/organizations';

import { AuthData } from './types';

export const resToAuthData = (res: any): AuthData => {
  return {
    token: res.token,
    user: res.user ? resToUser(res.user) : initialUser,
    organization: res.organizations.length
      ? resToOrganization(res.organizations[0])
      : initialOrganization,
  };
};

import { User } from '@/services/users/types';

import { UserEditFormData } from './validations';

export const dataToUserEditFormData = (data: User): UserEditFormData => {
  return {
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    organization: data.organizations[0],
  };
};

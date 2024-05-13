import { User } from '@/services/users';

import { UserProfileFormData } from './validations';

export const dataToUserProfileFormData = (data: User): UserProfileFormData => {
  return {
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
  };
};

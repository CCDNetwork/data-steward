import { Organization } from '@/services/organizations';

import { OrganizationEditFormData } from './validations';

export const dataToOrganizationEditFormData = (data: Organization): OrganizationEditFormData => {
  return {
    name: data.name,
  };
};

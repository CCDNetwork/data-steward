import { Organization } from '@/services/organizations';

export const resToOrganization = (res: any): Organization => {
  return {
    id: res.id ?? '',
    name: res.name ?? '',
    createdAt: res.createdAt ? new Date(res.createdAt) : null,
    updatedAt: res.updatedAt ? new Date(res.updatedAt) : null,
  };
};

export const organizationToReq = (data: any): Omit<Organization, 'id'> => {
  const req: any = {
    name: data.name ?? '',
  };

  return req;
};

export const organizationMeToReq = (data: any): Omit<Organization, 'id'> => {
  const req: any = {
    name: data.name ?? '',
  };

  return req;
};

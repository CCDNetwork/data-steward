import { resToOrganization } from '@/services/organizations';
import { User } from '@/services/users';

export const resToUser = (res: any): User => {
  return {
    id: res.id,
    email: res.email ?? '',
    firstName: res.firstName ?? '',
    lastName: res.lastName ?? '',
    activatedAt: res.activatedAt ? new Date(res.activatedAt) : null,
    createdAt: res.createdAt ? new Date(res.createdAt) : null,
    role: res.role ?? '',
    language: res.language ?? '',
    organizations: res.organizations ? res.organizations.map(resToOrganization) : [],
  };
};

export const userToReq = (data: any): Omit<User, 'id'> => {
  const req: any = {
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    language: data.language,
    role: data.role,
  };

  if (data.password) {
    req.password = data.password;
  }

  return req;
};

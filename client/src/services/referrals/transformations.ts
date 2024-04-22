import { resToOrganization } from '@/services/organizations';

import { Referral } from './types';
import { resToUser } from '../users';

export const resToReferral = (res: any): Referral => {
  return {
    id: res.id,
    firstName: res.firstName ?? '',
    lastName: res.lastName ?? '',
    updatedAt: res.activatedAt ? new Date(res.activatedAt) : null,
    createdAt: res.createdAt ? new Date(res.createdAt) : null,
    organizationReferredTo: res.organization ? resToOrganization(res.organization) : null,
    status: res.status ?? '',
    userCreated: res.userCreated ? resToUser(res.userCreated) : null,
  };
};

export const referralPostToReq = (data: any): Omit<Referral, 'id'> => {
  const req: any = {
    firstName: data.firstName,
    lastName: data.lastName,
    dateOfBirth: data.dateOfBirth,
    organizationId: data.organization.id,
  };

  return req;
};

export const referralPatchToReq = (data: any): Omit<Referral, 'id'> => {
  const req: any = {
    firstName: data.firstName,
    lastName: data.lastName,
    organizationId: data.organization.id,
    status: data.status,
    dateOfBirth: data.dateOfBirth,
  };

  return req;
};

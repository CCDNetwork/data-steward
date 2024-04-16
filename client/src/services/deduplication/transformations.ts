import { resToOrganization } from '@/services/organizations';

import { DeduplicationListing, UserCreated } from './types';

const resToUserCreated = (res: any): UserCreated => {
  return {
    id: res.id ?? '',
    activatedAt: res.activatedAt ? new Date(res.activatedAt) : null,
    createdAt: res.createdAt ? new Date(res.activatedAt) : null,
    email: res.email ?? '',
    firstName: res.firstName ?? '',
    language: res.language ?? '',
    lastName: res.lastName ?? '',
    organizations: res.organizations ? res.organizations(resToOrganization) : [],
    role: res.role ?? '',
  };
};

export const resToDeduplicationListing = (res: any): DeduplicationListing => {
  return {
    id: res.id ?? '',
    fileName: res.fileName ?? '',
    duplicates: res.duplicates ?? 0,
    userCreated: res.userCreated ? resToUserCreated(res.userCreated) : null,
    createdAt: res.createdAt ?? null,
    updatedAt: res.updatedAt ?? null,
  };
};

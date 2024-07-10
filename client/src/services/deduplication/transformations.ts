import { resToOrganization } from '@/services/organizations';

import { DeduplicationDataset, DeduplicationListing, UserCreated } from './types';

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

export const dataToDatasetRequest = (data: { file: File; templateId: string }): FormData => {
  const formData = new FormData();
  formData.append('file', data.file);
  formData.append('templateId', data.templateId);
  return formData;
};

export const resToDatasetResponse = (res: any): DeduplicationDataset => {
  return {
    file: res.file ?? null,
    templateId: res.templateId ?? '',
    duplicates: res.duplicates ?? 0,
    duplicateBeneficiaries: res.duplicateBeneficiaries ?? [],
  };
};

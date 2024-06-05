import { resToOrganization } from '@/services/organizations';

import { Referral } from './types';
import { resToUser } from '../users';
import { resToStorageFile } from '../storage';

export const resToReferral = (res: any): Referral => {
  return {
    id: res.id,
    focalPoint: res.focalPoint ? resToUser(res.focalPoint) : null,
    consent: res.consent ?? false,
    familyName: res.familyName ?? '',
    firstName: res.firstName ?? '',
    methodOfContact: res.methodOfContact ?? '',
    contactDetails: res.contactDetails ?? '',
    oblast: res.oblast ?? '',
    raion: res.raion ?? '',
    hromada: res.hromada ?? '',
    settlement: res.settlement ?? '',
    note: res.note ?? '',
    organizationReferredTo: res.organizationReferredTo ? resToOrganization(res.organizationReferredTo) : null,
    userCreated: res.userCreated ? resToUser(res.userCreated) : null,
    status: res.status ?? '',
    isDraft: res.isDraft ?? false,
    files: res.files ? res.files.map(resToStorageFile) : [],
    createdAt: res.createdAt ? new Date(res.createdAt) : null,
    updatedAt: res.updatedAt ? new Date(res.updatedAt) : null,
  };
};

export const referralPostToReq = (data: any): Omit<Referral, 'id'> => {
  const req: any = {
    focalPointId: data.focalPoint?.id ?? undefined,
    consent: data.consent,
    familyName: data.familyName,
    firstName: data.firstName,
    methodOfContact: data.methodOfContact,
    contactDetails: data.contactDetails,
    note: data.note,
    organizationId: data.organizationReferredTo?.id,
    fileIds: data.files?.map((i: any) => i.id) || [],
    isDraft: data.isDraft,
    settlement: 'settlement',
  };

  return req;
};

export const referralPatchToReq = (data: any): Omit<Referral, 'id'> => {
  const req: any = {
    focalPointId: data.focalPoint?.id,
    consent: data.consent,
    familyName: data.familyName,
    firstName: data.firstName,
    methodOfContact: data.methodOfContact,
    contactDetails: data.contactDetails,
    note: data.note,
    organizationId: data.organizationReferredTo?.id,
    fileIds: data.files?.map((i: any) => i.id),
    isDraft: data.isDraft,
    status: data.status,
  };

  return req;
};

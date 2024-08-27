import {
  OrgActivity,
  OrganizationActivity,
  resToActivities,
  resToOrganization,
} from '@/services/organizations';

import { Referral, ReferralUser } from './types';
import { resToUser } from '../users';
import { resToStorageFile } from '../storage';

export const resToReferral = (res: any): Referral => {
  return {
    caseNumber: res.caseNumber ?? '',
    id: res.id,
    isUrgent: res.isUrgent ?? false,
    subactivitiesIds: res.subactivitiesIds ?? [],
    serviceCategory: res.serviceCategory ?? '',
    subactivities: res.subactivities
      ? res.subactivities.map(resToActivities)
      : [],
    organizationReferredToId: res.organizationReferredToId ?? '',
    organizationReferredTo: res.organizationReferredTo
      ? resToOrganization(res.organizationReferredTo)
      : null,
    displacementStatus: res.displacementStatus ?? '',
    householdSize: res.householdSize ?? '',
    householdMonthlyIncome: res.householdMonthlyIncome ?? '',
    householdsVulnerabilityCriteria: res.householdsVulnerabilityCriteria ?? [],
    firstName: res.firstName ?? '',
    patronymicName: res.patronymicName ?? '',
    surname: res.surname ?? '',
    dateOfBirth: new Date(res.dateOfBirth),
    gender: res.gender ?? '',
    taxId: res.taxId ?? '',
    address: res.address ?? '',
    oblast: res.oblast ?? '',
    ryon: res.ryon ?? '',
    hromada: res.hromada ?? '',
    settlement: res.settlement ?? '',
    email: res.email ?? '',
    phone: res.phone ?? '',
    contactPreference: res.contactPreference ?? '',
    restrictions: res.restrictions ?? '',
    consent: res.consent ?? false,
    required: res.required ?? '',
    needForService: res.needForService ?? '',
    isSeparated: res.isSeparated ?? false,
    caregiver: res.caregiver ?? '',
    relationshipToChild: res.relationshipToChild ?? '',
    caregiverEmail: res.caregiverEmail ?? '',
    caregiverPhone: res.caregiverPhone ?? '',
    caregiverContactPreference: res.caregiverContactPreference ?? '',
    isCaregiverInformed: res.isCaregiverInformed
      ? res.isCaregiverInformed.toString()
      : 'false',
    caregiverExplanation: res.caregiverExplanation ?? '',
    caregiverNote: res.caregiverNote ?? '',
    focalPointId: res.focalPointId ?? '',
    focalPoint: res.focalPoint ? resToUser(res.focalPoint) : null,
    status: res.status ?? '',
    isDraft: res.isDraft ?? false,
    fileIds: res.fileIds ? res.fileIds.map(String) : [],
    organizationCreated: res.organizationCreated
      ? resToOrganization(res.organizationCreated)
      : null,
    userCreated: res.userCreated ? resToUser(res.userCreated) : null,
    files: res.files ? res.files.map(resToStorageFile) : [],
    isRejected: res.isRejected ?? false,
    createdAt: res.createdAt ? new Date(res.createdAt) : null,
    updatedAt: res.updatedAt ? new Date(res.updatedAt) : null,
  };
};

export const referralPostToReq = (data: any): Omit<Referral, 'id'> => {
  const req: any = {
    isUrgent: data.isUrgent,
    organizationReferredToId: data.organizationReferredTo?.id,
    serviceCategory: data.serviceCategory,
    // displacementStatus: data.displacementStatus,
    // householdSize: data.householdSize,
    // householdMonthlyIncome: data.householdMonthlyIncome,
    // householdsVulnerabilityCriteria: data.householdsVulnerabilityCriteria,
    firstName: data.firstName,
    patronymicName: data.patronymicName,
    subactivitiesIds:
      data.subactivities && data.subactivities.length > 0
        ? data.subactivities.map((i: OrganizationActivity) => i.id)
        : [],
    surname: data.surname,
    dateOfBirth: data.dateOfBirth ? data.dateOfBirth.toISOString() : null,
    gender: data.gender,
    taxId: data.taxId,
    address: data.address,
    oblast: data.oblast,
    ryon: data.ryon,
    hromada: data.hromada,
    settlement: data.settlement,
    email: data.email,
    phone: data.phone,
    contactPreference: data.contactPreference,
    restrictions: data.restrictions,
    consent: data.consent,
    required: data.required,
    needForService: data.needForService,
    fileIds: data.files?.map((i: any) => i.id) || [],
    isSeparated: data.isSeparated,
    caregiver: data.caregiver,
    relationshipToChild: data.relationshipToChild,
    caregiverEmail: data.caregiverEmail,
    caregiverPhone: data.caregiverPhone,
    caregiverContactPreference: data.caregiverContactPreference,
    isCaregiverInformed: data.isCaregiverInformed === 'true',
    caregiverExplanation: data.caregiverExplanation,
    caregiverNote: data.caregiverNote,
    isDraft: data.isDraft,
    focalPointId: data.focalPoint?.id ?? undefined,
    methodOfContact: data.methodOfContact,
    note: data.note,
    organizationId: data.organizationReferredTo?.id,
    status: data.status,
  };

  if (data.serviceCategory && data.serviceCategory === OrgActivity.Mpca) {
    req.displacementStatus = data.displacementStatus;
    req.householdSize = data.householdSize;
    req.householdMonthlyIncome = data.householdMonthlyIncome;
    req.householdsVulnerabilityCriteria = data.householdsVulnerabilityCriteria;
  }

  return req;
};

export const referralPatchToReq = (data: any): Omit<Referral, 'id'> => {
  const req: any = {
    isUrgent: data.isUrgent,
    serviceCategory: data.serviceCategory,
    firstName: data.firstName,
    patronymicName: data.patronymicName,
    surname: data.surname,
    gender: data.gender,
    taxId: data.taxId,
    address: data.address,
    oblast: data.oblast,
    ryon: data.ryon,
    hromada: data.hromada,
    settlement: data.settlement,
    email: data.email,
    phone: data.phone,
    contactPreference: data.contactPreference,
    restrictions: data.restrictions,
    consent: data.consent,
    required: data.required,
    needForService: data.needForService,
    isSeparated: data.isSeparated,
    caregiver: data.caregiver,
    relationshipToChild: data.relationshipToChild,
    caregiverEmail: data.caregiverEmail,
    caregiverPhone: data.caregiverPhone,
    caregiverContactPreference: data.caregiverContactPreference,
    caregiverExplanation: data.caregiverExplanation,
    caregiverNote: data.caregiverNote,
    status: data.status,
    isDraft: data.isDraft,
    isRejected: data.isRejected,
  };

  if (data.serviceCategory && data.serviceCategory === OrgActivity.Mpca) {
    req.displacementStatus = data.displacementStatus;
    req.householdSize = data.householdSize;
    req.householdMonthlyIncome = data.householdMonthlyIncome;
    req.householdsVulnerabilityCriteria = data.householdsVulnerabilityCriteria;
  }

  if (data.organizationReferredTo && data.organizationReferredTo.id) {
    req.organizationReferredToId = data.organizationReferredTo.id;
  }

  if (data.subactivities && data.subactivities.length > 0) {
    req.subactivitiesIds = data.subactivities.map(
      (i: OrganizationActivity) => i.id
    );
  }

  if (data.dateOfBirth) {
    req.dateOfBirth = data.dateOfBirth.toISOString();
  }

  if (data.files && data.files.length > 0) {
    req.fileIds = data.files.map((i: any) => i.id);
  }

  if (data.isCaregiverInformed) {
    req.isCaregiverInformed = data.isCaregiverInformed === 'true';
  }

  if (data.focalPoint && data.focalPoint.id) {
    req.focalPointId = data.focalPoint.id;
  }

  return req;
};

export const resToReferralUser = (res: any): ReferralUser => {
  return {
    id: res.id,
    email: res.email ?? '',
    firstName: res.firstName ?? '',
    lastName: res.lastName ?? '',
    createdAt: res.createdAt ? new Date(res.createdAt) : null,
  };
};

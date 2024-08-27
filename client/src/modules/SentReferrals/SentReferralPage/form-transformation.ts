import { Organization } from '@/services/organizations';
import { Referral } from '@/services/referrals';

import { SentReferralFormData } from './validations';
import { User } from '@/services/users';

export const dataToSentReferralFormData = (
  data: Referral
): SentReferralFormData & { noTaxId: boolean; isMinor: boolean } => {
  return {
    isUrgent: data.isUrgent,
    serviceCategory: data.serviceCategory,
    subactivities: data.subactivities,
    subactivitiesIds: data.subactivitiesIds,
    organizationReferredTo: data.organizationReferredTo as Organization,
    displacementStatus: data.displacementStatus,
    householdSize: data.householdSize,
    householdMonthlyIncome: data.householdMonthlyIncome,
    householdsVulnerabilityCriteria: data.householdsVulnerabilityCriteria,
    firstName: data.firstName,
    patronymicName: data.patronymicName,
    surname: data.surname,
    dateOfBirth: new Date(data.dateOfBirth),
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
    isSeparated: data.isSeparated ?? false,
    caregiver: data.caregiver,
    relationshipToChild: data.relationshipToChild,
    caregiverEmail: data.caregiverEmail,
    caregiverPhone: data.caregiverPhone,
    caregiverContactPreference: data.caregiverContactPreference,
    isCaregiverInformed: data.isCaregiverInformed ?? 'false',
    caregiverExplanation: data.caregiverExplanation,
    caregiverNote: data.caregiverPhone,
    focalPointId: data.focalPointId,
    focalPoint: data.focalPoint as User,
    status: data.status,
    isDraft: data.isDraft,
    isRejected: data.isRejected,
    userCreated: data.userCreated as User,
    files: data.files,
    noTaxId: false,
    isMinor:
      !!data.caregiver || !!data.relationshipToChild || !!data.caregiverEmail,
  };
};

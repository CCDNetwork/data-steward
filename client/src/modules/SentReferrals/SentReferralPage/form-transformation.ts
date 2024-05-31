import { Organization } from '@/services/organizations';
import { SentReferralFormData } from './validations';
import { Referral } from '@/services/referrals';

export const dataToSentReferralFormData = (data: Referral): SentReferralFormData => {
  return {
    focalPoint: data.focalPoint,
    consent: data.consent,
    familyName: data.familyName,
    firstName: data.firstName,
    methodOfContact: data.methodOfContact,
    contactDetails: data.contactDetails,
    note: data.note,
    organizationReferredTo: data.organizationReferredTo as Organization,
    isDraft: data.isDraft,
    files: data.files,
  };
};

import { Organization } from '@/services/organizations';
import { Referral } from '@/services/referrals';

import { SentReferralFormData } from './validations';
import { User } from '@/services/users';

export const dataToSentReferralFormData = (data: Referral): SentReferralFormData => {
  return {
    focalPoint: data.focalPoint as User,
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

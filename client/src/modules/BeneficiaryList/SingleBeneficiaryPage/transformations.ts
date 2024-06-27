import { Beneficiary } from '@/services/beneficiaryList';

export const dataToDuplicateBeneficiaryValues = (data: Beneficiary) => {
  return {
    'First Name': data.firstName ?? null,
    'Family Name': data.familyName ?? null,
    Gender: data.gender ?? null,
    'Date of Birth': data.dateOfBirth ?? null,
    'Community ID': data.communityId ?? null,
    'Household ID': data.hhId ?? null,
    'Mobile Phone ID': data.mobilePhoneId ?? null,
    'Gov Type ID': data.govIdType ?? null,
    'Gov ID Number': data.govIdNumber ?? null,
    'Other ID Type': data.otherIdType ?? null,
    'Other ID Number': data.otherIdNumber ?? null,
    'Assistance Details': data.assistanceDetails ?? null,
    Activity: data.activity ?? null,
    Currency: data.currency ?? null,
    'Currency Amount': data.currencyAmount ?? null,
    'Start Date': data.startDate ?? null,
    'End Date': data.endDate ?? null,
    Frequency: data.frequency ?? null,
  };
};

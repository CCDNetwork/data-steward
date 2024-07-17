import { Beneficiary } from '@/services/beneficiaryList';
import { MATCHED_FIELDS, SingleBeneficiary } from './types';
import { BENEFICIARY_STATUS } from '@/components/BeneficiaryStatus/const';

export const beneficiaryDataToSingleBeneficiary = (res: Beneficiary | undefined): SingleBeneficiary => {
  return {
    id: res?.id || '',
    isPrimary: res?.isPrimary || false,
    status: res?.status || '',
    firstName: res?.firstName || 'N/A',
    surname: res?.familyName || 'N/A',
    dateOfBirth: res?.dateOfBirth || 'N/A',
    gender: res?.gender || 'N/A',
    hhId: res?.hhId || 'N/A',
    mobilePhoneId: res?.mobilePhoneId || 'N/A',
    govIdType: res?.govIdType || 'N/A',
    govIdNumber: res?.govIdNumber || 'N/A',
    otherIdType: res?.otherIdType || 'N/A',
    otherIdNumber: res?.otherIdNumber || 'N/A',
    adminLevel1: res?.adminLevel1 || 'N/A',
    adminLevel2: res?.adminLevel2 || 'N/A',
    adminLevel3: res?.adminLevel3 || 'N/A',
    adminLevel4: res?.adminLevel4 || 'N/A',
    assistanceDetails: res?.assistanceDetails || 'N/A',
    activity: res?.activity || 'N/A',
    currency: res?.activity || 'N/A',
    currencyAmount: res?.currencyAmount || 'N/A',
    startDate: res?.startDate || 'N/A',
    endDate: res?.endDate || 'N/A',
    frequency: res?.frequency || 'N/A',
    updatedAt: res?.updatedAt || null,
    matchedFields: res?.matchedFields || [],
    pointOfContact: res?.pointOfContact || null,
    uploadedBy: res?.uploadedBy || null,
    organization: res?.organization || null,
    duplicates: res?.duplicates ? res?.duplicates.map(beneficiaryDataToSingleBeneficiary) : [],
  };
};

export const renameMathedFields = (field: string) => {
  switch (field) {
    case MATCHED_FIELDS.Status:
      return 'Status';
    case MATCHED_FIELDS.FirstName:
      return 'First name';
    case MATCHED_FIELDS.FamilyName:
      return 'Family name';
    case MATCHED_FIELDS.Gender:
      return 'Gender';
    case MATCHED_FIELDS.DateOfBirth:
      return 'Date of birth';
    case MATCHED_FIELDS.HhId:
      return 'Household ID';
    case MATCHED_FIELDS.MobilePhoneId:
      return 'Mobile phone ID';
    case MATCHED_FIELDS.GovIdType:
      return 'Gov ID type';
    case MATCHED_FIELDS.GovIdNumber:
      return 'Gov ID number';
    case MATCHED_FIELDS.OtherIdType:
      return 'Other ID type';
    case MATCHED_FIELDS.OtherIdNumber:
      return 'Other ID number';
    case MATCHED_FIELDS.AssistanceDetails:
      return 'Assistance details';
    case MATCHED_FIELDS.Activity:
      return 'Activity';
    case MATCHED_FIELDS.Currency:
      return 'Currency';
    case MATCHED_FIELDS.CurrencyAmount:
      return 'Currency amount';
    case MATCHED_FIELDS.StartDate:
      return 'Start date';
    case MATCHED_FIELDS.EndDate:
      return 'End date';
    case MATCHED_FIELDS.Frequency:
      return 'Frequency';

    default:
      return '';
  }
};

export const getBeneficiaryStatus = (currentStatus: string) => {
  switch (currentStatus) {
    case BENEFICIARY_STATUS.AcceptedDuplicate:
      return 'Accepted Duplicate';
    case BENEFICIARY_STATUS.NotDuplicate:
      return 'Not Duplicate';
    case BENEFICIARY_STATUS.RejectedDuplicate:
      return 'Rejected Duplicate';

    default:
      return '';
  }
};

import { Organization } from '@/services/organizations';
import { User } from '@/services/users';

export interface SingleBeneficiary {
  id: string;
  isPrimary: boolean;
  status: string;
  firstName: string;
  surname: string;
  dateOfBirth: string;
  gender: string;
  hhId: string;
  mobilePhoneId: string;
  govIdType: string;
  govIdNumber: string;
  otherIdType: string;
  otherIdNumber: string;
  adminLevel1: string;
  adminLevel2: string;
  adminLevel3: string;
  adminLevel4: string;
  assistanceDetails: string;
  activity: string;
  currency: string;
  currencyAmount: string;
  startDate: string;
  endDate: string;
  frequency: string;
  updatedAt: Date | null;
  matchedFields: string[];
  pointOfContact: User | null;
  uploadedBy: User | null;
  organization: Organization | null;
  duplicates: SingleBeneficiary[];
}

export enum MATCHED_FIELDS {
  Status = 'Status',
  FirstName = 'FirstName',
  FamilyName = 'FamilyName',
  Gender = 'Gender',
  DateOfBirth = 'DateOfBirth',
  HhId = 'HhId',
  MobilePhoneId = 'MobilePhoneId',
  GovIdType = 'GovIdType',
  GovIdNumber = 'GovIdNumber',
  OtherIdType = 'OtherIdType',
  OtherIdNumber = 'OtherIdNumber',
  AssistanceDetails = 'AssistanceDetails',
  Activity = 'Activity',
  Currency = 'Currency',
  CurrencyAmount = 'CurrencyAmount',
  StartDate = 'StartDate',
  EndDate = 'EndDate',
  Frequency = 'Frequency',
}

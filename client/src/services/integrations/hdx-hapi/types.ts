export interface Beneficiary {
  id: string;
  firstName: string;
  familyName: string;
  gender: string;
  dateOfBirth: string;
  communityId: string;
  hhId: string;
  mobilePhoneId: string;
  govIdType: string;
  govIdNumber: string;
  otherIdType: string;
  otherIdNumber: string;
  assistanceDetails: string;
  activity: string;
  currency: string;
  currencyAmount: string;
  startDate: string;
  endDate: string;
  frequency: string;
  isPrimary: boolean;
  status: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

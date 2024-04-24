import { User } from '../users';

export interface Template {
  id: string;
  name: string;
  firstName: string;
  familyName: string;
  gender: string;
  dateofBirth: string;
  communityID: string;
  hhid: string;
  mobilePhoneID: string;
  govIDType: string;
  govIDNumber: string;
  otherIDType: string;
  otherIDNumber: string;
  assistanceDetails: string;
  activity: string;
  currency: string;
  currencyAmount: string;
  startDate: string;
  endDate: string;
  frequency: string;
  userCreated: User | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

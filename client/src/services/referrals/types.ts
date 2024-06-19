import { Organization } from '@/services/organizations';

import { User } from '../users';
import { StorageFile } from '../storage';

export interface Referral {
  id: string;
  isUrgent: boolean;
  serviceCategory: string;
  subactivities: string[];
  organizationReferredToId: string;
  organizationReferredTo: Organization | null;
  displacementStatus: string;
  householdSize: string;
  householdMonthlyIncome: string;
  householdsVulnerabilityCriteria: string[];
  firstName: string;
  patronymicName: string;
  surname: string;
  dateOfBirth: Date;
  gender: string;
  taxId: string;
  address: string;
  oblast: string;
  ryon: string;
  hromada: string;
  settlement: string;
  email: string;
  phone: string;
  contactPreference: string;
  restrictions: string;
  consent: boolean;
  required: string;
  needForService: string;
  isSeparated: boolean;
  caregiver: string;
  relationshipToChild: string;
  caregiverEmail: string;
  caregiverPhone: string;
  caregiverContactPreference: string;
  isCaregiverInformed: string;
  caregiverExplanation: string;
  caregiverNote: string;
  focalPointId: string;
  focalPoint: User | null;
  status: string;
  isDraft: boolean;
  fileIds: string[];
  organizationCreated: Organization | null;
  userCreated: User | null;
  files: StorageFile[];

  // familyName: string;
  // methodOfContact: string;
  // contactDetails: string;
  // note: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

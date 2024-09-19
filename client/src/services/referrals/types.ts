import { Organization, OrganizationActivity } from '@/services/organizations';

import { User } from '../users';
import { StorageFile } from '../storage';
import { AdministrativeRegion } from '../administrativeRegions/types';

export interface Referral {
  caseNumber: string;
  id: string;
  isUrgent: boolean;
  serviceCategory: string;
  subactivities: OrganizationActivity[];
  subactivitiesIds: string[];
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

  administrativeRegion1Id: string;
  administrativeRegion2Id: string;
  administrativeRegion3Id: string;
  administrativeRegion4Id: string;

  administrativeRegion1: AdministrativeRegion | null;
  administrativeRegion2: AdministrativeRegion | null;
  administrativeRegion3: AdministrativeRegion | null;
  administrativeRegion4: AdministrativeRegion | null;

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
  isRejected: boolean;
  fileIds: string[];
  organizationCreated: Organization | null;
  userCreated: User | null;
  files: StorageFile[];
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface ReferralUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date | null;
}

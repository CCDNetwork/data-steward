import { Organization } from '@/services/organizations';

import { User } from '../users';
import { StorageFile } from '../storage';

export interface Referral {
  id: string;
  focalPoint: string;
  consent: boolean;
  familyName: string;
  firstName: string;
  methodOfContact: string;
  contactDetails: string;
  oblast: string;
  raion: string;
  hromada: string;
  settlement: string;
  note: string;
  organizationReferredTo: Organization | null;
  userCreated: User | null;
  status: string;
  isDraft: boolean;
  files: StorageFile[];
  createdAt: Date | null;
  updatedAt: Date | null;
}

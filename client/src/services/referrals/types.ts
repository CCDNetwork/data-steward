import { Organization } from '@/services/organizations';
import { User } from '../users';

export interface Referral {
  id: string;
  firstName: string;
  lastName: string;
  organizationReferredTo: Organization | null;
  userCreated: User | null;
  status: 'pending' | 'accepted';
  createdAt: Date | null;
  updatedAt: Date | null;
}

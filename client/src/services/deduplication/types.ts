import { Organization } from '@/services/organizations';

export interface UserCreated {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  activatedAt: Date | null;
  createdAt: Date | null;
  role: '';
  language: string;
  organizations: Organization[] | [];
}

export interface DeduplicationListing {
  id: string;
  fileName: string;
  userCreated: UserCreated | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

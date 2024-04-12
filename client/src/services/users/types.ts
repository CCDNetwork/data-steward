import { Organization } from '@/services/organizations';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  activatedAt: Date | null;
  createdAt: Date | null;
  role: string;
  language: string;
  organizations: Organization[];
}

export interface UserProfileRequestPayload {
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
}

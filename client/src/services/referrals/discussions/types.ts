import { User } from '@/services/users';

export type ReferralDiscussion = {
  id: string;
  referralId: string;
  userCreated: User | null;
  text: string;
  isBot: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
};

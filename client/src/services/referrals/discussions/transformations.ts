import { resToUser } from '@/services/users';
import { ReferralDiscussion } from './types';

export const resToReferralDiscussion = (res: any): ReferralDiscussion => {
  return {
    id: res.id,
    referralId: res.referralId,
    userCreated: res.userCreated ? resToUser(res.userCreated) : null,
    isBot: res.isBot ?? false,
    text: res.text ?? '',
    createdAt: res.createdAt ? new Date(res.createdAt) : null,
    updatedAt: res.updatedAt ? new Date(res.updatedAt) : null,
  };
};

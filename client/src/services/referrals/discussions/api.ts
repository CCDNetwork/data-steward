import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { resToReferralDiscussion } from './transformations';
import { ReferralDiscussion } from './types';
import { api } from '@/services/api';

enum QueryKeys {
  ReferralDiscussion = 'referral_discussion',
}

//
// API calls
//
export const fetchReferralDiscussion = async (
  referralId: string
): Promise<ReferralDiscussion[]> => {
  const resp = await api.get(`/referrals/${referralId}/discussions`);

  return resp.data.map(resToReferralDiscussion).reverse();
};

const postReferralDiscussionText = async ({
  referralId,
  text,
}: {
  referralId: string;
  text: string;
}): Promise<ReferralDiscussion> => {
  const resp = await api.post(`/referrals/${referralId}/discussions`, { text });

  return resToReferralDiscussion(resp.data);
};

//
// GET hooks
//

export const useReferralDiscussion = ({
  referralId,
}: {
  referralId: string;
}) => {
  return useQuery(
    [QueryKeys.ReferralDiscussion, referralId],
    () => fetchReferralDiscussion(referralId),
    {
      enabled: !!referralId,
    }
  );
};

//
// Mutation hooks
//

export const useReferralDiscussionMutation = () => {
  const queryClient = useQueryClient();

  return {
    createReferralDiscussionEntry: useMutation(postReferralDiscussionText, {
      onSuccess: () =>
        queryClient.invalidateQueries([QueryKeys.ReferralDiscussion]),
    }),
  };
};

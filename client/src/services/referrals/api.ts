import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { DataWithMeta, PaginationRequest, paginationRequestToUrl } from '@/helpers/pagination';
import { useGlobalErrors } from '@/providers/GlobalProvider';

import { referralPatchToReq, referralPostToReq, resToReferral } from './transformations';
import { Referral } from './types';
import { api } from '../api';
import { SentReferralFormData } from '@/modules/SentReferrals/SentReferralPage/validations';

enum QueryKeys {
  Referrals = 'referrals',
  SingleReferral = 'single_referral',
}

//
// API calls
//
export const fetchReferrals = async ({
  pagination,
  received = false,
}: {
  pagination: PaginationRequest;
  received?: boolean;
}): Promise<DataWithMeta<Referral>> => {
  const url = paginationRequestToUrl('referrals', pagination);
  const resp = await api.get(url + `&received=${received}`);

  return {
    meta: resp.data.meta,
    data: resp.data.data?.map(resToReferral) ?? [],
  };
};

const fetchReferral = async (id: string): Promise<Referral> => {
  const resp = await api.get(`/referrals/${id}`);
  return resToReferral(resp.data);
};

const postReferral = async (data: SentReferralFormData): Promise<Referral> => {
  const resp = await api.post(`/referrals`, referralPostToReq(data));
  return resToReferral(resp.data);
};

const patchReferralReason = async (data: {
  referralId: string;
  referralType: string;
  text: string;
}): Promise<Referral> => {
  const resp = await api.patch(`/referrals/${data.referralId}/${data.referralType}`, { text: data.text });
  return resToReferral(resp.data);
};

const patchReferral = async ({
  referralId,
  data,
}: {
  referralId: string;
  data: Partial<SentReferralFormData>;
}): Promise<Referral> => {
  const resp = await api.patch(`/referrals/${referralId}`, referralPatchToReq(data));
  return resToReferral(resp.data);
};

const deleteReferral = async (referralId: string): Promise<Referral> => {
  const resp = await api.delete(`/referrals/${referralId}`);
  return resToReferral(resp.data);
};

//
// GET hooks
//

export const useReferrals = ({
  currentPage,
  pageSize,
  sortBy,
  sortDirection,
  debouncedSearch,
  filters,
  received,
}: any) => {
  return useQuery(
    [QueryKeys.Referrals, currentPage, pageSize, sortBy, sortDirection, debouncedSearch, filters, received],
    () =>
      fetchReferrals({
        pagination: { page: currentPage, pageSize, sortBy, sortDirection, search: debouncedSearch, filters },
        received,
      }),
  );
};

export const useReferral = ({ id, isCreate }: { id: string; isCreate: boolean }) => {
  const { onSetCollectionNotFound } = useGlobalErrors();

  return useQuery([QueryKeys.SingleReferral, id], () => fetchReferral(id), {
    enabled: !isCreate,
    onError: () => onSetCollectionNotFound(true),
  });
};

//
// Mutation hooks
//

export const useReferralMutation = () => {
  const queryClient = useQueryClient();

  return {
    createReferral: useMutation(postReferral, {
      onSuccess: () => queryClient.invalidateQueries([QueryKeys.Referrals]),
    }),
    updateReferralReason: useMutation(patchReferralReason, {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.Referrals]);
        queryClient.invalidateQueries([QueryKeys.SingleReferral]);
      },
    }),
    patchReferral: useMutation(patchReferral, {
      onSuccess: () => {
        queryClient.invalidateQueries([QueryKeys.Referrals]);
        queryClient.invalidateQueries([QueryKeys.SingleReferral]);
      },
    }),
    removeReferral: useMutation(deleteReferral, {
      onSuccess: () => queryClient.invalidateQueries([QueryKeys.Referrals]),
    }),
  };
};

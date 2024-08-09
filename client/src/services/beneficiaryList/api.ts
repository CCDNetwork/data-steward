import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useGlobalErrors } from '@/providers/GlobalProvider';
import { DataWithMeta, PaginationRequest, paginationRequestToUrl } from '@/helpers/pagination';
import { api } from '@/services';

import { Beneficiary } from './types';
import { resToBeneficiary } from './transformations';

enum QueryKeys {
  BeneficiaryList = 'beneficiary-list',
}

export const fetchBeneficiaryList = async (pagination: PaginationRequest): Promise<DataWithMeta<Beneficiary>> => {
  const url = paginationRequestToUrl('/beneficiaries', pagination);

  const resp = await api.get(url);
  return {
    meta: resp.data.meta,
    data: resp.data.data?.map(resToBeneficiary) ?? [],
  };
};

const fetchBeneficiary = async (id: string): Promise<Beneficiary> => {
  const resp = await api.get(`/beneficiaries/${id}`);

  return resToBeneficiary(resp.data);
};

const patchBeneficiaryStatus = async ({
  beneficiaryId,
  status,
}: {
  beneficiaryId: string;
  status: string;
}): Promise<Beneficiary> => {
  const resp = await api.patch(`/beneficiaries/${beneficiaryId}/status`, { status });

  return resToBeneficiary(resp.data);
};

const deleteBeneficiary = async ({ beneficiaryId }: { beneficiaryId: string }): Promise<object> => {
  const resp = await api.delete(`/beneficiaries/${beneficiaryId}`);
  return resp.data;
};

export const useBeneficiaryList = ({ currentPage, pageSize, sortBy, sortDirection, debouncedSearch, filters }: any) => {
  return useQuery(
    [QueryKeys.BeneficiaryList, currentPage, pageSize, sortBy, sortDirection, debouncedSearch, filters],
    () =>
      fetchBeneficiaryList({
        page: currentPage,
        pageSize,
        sortBy,
        sortDirection,
        search: debouncedSearch,
        filters,
      }),
  );
};

export const useBeneficiary = ({ id }: { id: string }) => {
  const { onSetCollectionNotFound } = useGlobalErrors();

  return useQuery([QueryKeys.BeneficiaryList, id], () => fetchBeneficiary(id), {
    onError: () => onSetCollectionNotFound(true),
  });
};

export const useBeneficiariesMutation = () => {
  const queryClient = useQueryClient();
  return {
    changeBeneficiaryStatus: useMutation(patchBeneficiaryStatus, {
      onSuccess: () => queryClient.invalidateQueries([QueryKeys.BeneficiaryList]),
    }),
    removeBeneficiary: useMutation(deleteBeneficiary),
  };
};

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { DataWithMeta, PaginationRequest, paginationRequestToUrl } from '@/helpers/pagination';
import { useGlobalErrors } from '@/providers/GlobalProvider';

import { api } from '../api';
import { Handbook } from './types';
import { handbookToReq, resToHandbook } from './transformations';
import { HandbookForm } from '@/modules/HandbookPage';

enum QueryKeys {
  Handbook = 'handbook',
  SingleHandbook = 'single_handbook',
}

//
// API calls
//
export const fetchHandbooks = async (pagination: PaginationRequest): Promise<DataWithMeta<Handbook>> => {
  const url = paginationRequestToUrl('handbooks', pagination);

  const resp = await api.get(url);
  return {
    meta: resp.data.meta,
    data: resp.data.data?.map(resToHandbook) ?? [],
  };
};

const fetchHandbook = async (id: string): Promise<Handbook> => {
  const resp = await api.get(`/handbooks/${id}`);
  return resToHandbook(resp.data);
};

const postHandbook = async (data: HandbookForm): Promise<Handbook> => {
  const resp = await api.post(`/handbooks`, handbookToReq(data));
  return resToHandbook(resp.data);
};

const putHandbook = async ({ data, handbookId }: { data: HandbookForm; handbookId: string }): Promise<Handbook> => {
  const resp = await api.put(`/handbooks/${handbookId}`, handbookToReq(data));
  return resToHandbook(resp.data);
};

const deleteHandbook = async (handbookId: string): Promise<Handbook> => {
  const resp = await api.delete(`/handbooks/${handbookId}`);
  return resToHandbook(resp.data);
};

//
// GET hooks
//

export const useHandbooks = ({ currentPage, pageSize, sortBy, sortDirection, debouncedSearch }: any) => {
  return useQuery([QueryKeys.Handbook, currentPage, pageSize, sortBy, sortDirection, debouncedSearch], () =>
    fetchHandbooks({ page: currentPage, pageSize, sortBy, sortDirection, search: debouncedSearch }),
  );
};

export const useHandbook = ({ id, isCreate }: { id: string; isCreate: boolean }) => {
  const { onSetCollectionNotFound } = useGlobalErrors();

  return useQuery([QueryKeys.SingleHandbook, id], () => fetchHandbook(id), {
    enabled: !isCreate,
    onError: () => onSetCollectionNotFound(true),
  });
};

//
// Mutation hooks
//

export const useHandbookMutation = () => {
  const queryClient = useQueryClient();

  return {
    createHandbook: useMutation(postHandbook, {
      onSuccess: () => queryClient.invalidateQueries([QueryKeys.Handbook]),
    }),
    editHandbook: useMutation(putHandbook, {
      onSuccess: () => queryClient.invalidateQueries([QueryKeys.SingleHandbook]),
    }),
    deleteHandbook: useMutation(deleteHandbook, {
      onSuccess: () => queryClient.invalidateQueries([QueryKeys.Handbook]),
    }),
  };
};

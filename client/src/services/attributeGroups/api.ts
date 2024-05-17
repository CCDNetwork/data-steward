import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { DataWithMeta, PaginationRequest, paginationRequestToUrl } from '@/helpers/pagination';
import { useGlobalErrors } from '@/providers/GlobalProvider';

import { api } from '../api';
import { AttributeGroup } from './types';
import { attributeGroupToReq, resToAttributeGroup } from './transformations';
import { RulesForm } from '@/modules/Rules';

enum QueryKeys {
  AttributeGroups = 'attribute_groups',
  SingleAttributeGroup = 'single_attribute_group',
}

//
// API calls
//
export const fetchAttributeGroups = async (pagination: PaginationRequest): Promise<DataWithMeta<AttributeGroup>> => {
  const url = paginationRequestToUrl('beneficiary-attribute/groups', pagination);
  const resp = await api.get(url);

  return {
    meta: resp.data.meta,
    data: resp.data.data?.map(resToAttributeGroup) ?? [],
  };
};

const fetchAttributeGroup = async (id: string): Promise<AttributeGroup> => {
  const resp = await api.get(`/beneficiary-attribute/groups/${id}`);
  return resToAttributeGroup(resp.data);
};

const postAttributeGroup = async (attributeFormData: RulesForm): Promise<AttributeGroup> => {
  const resp = await api.post(`/beneficiary-attribute/groups`, attributeGroupToReq(attributeFormData));
  return resToAttributeGroup(resp.data);
};

const postReorderAttributeGroups = async ({
  newOrderList,
}: {
  newOrderList: { id: string; order: number }[];
}): Promise<AttributeGroup> => {
  const resp = await api.post(`/beneficiary-attribute/groups/reorder`, { newOrderList });
  return resp.data.data.map(resToAttributeGroup);
};

const patchAttributeGroup = async ({
  attributeFormData,
  attributeGroupId,
}: {
  attributeFormData: RulesForm;
  attributeGroupId: string;
}): Promise<AttributeGroup> => {
  const resp = await api.patch(
    `/beneficiary-attribute/groups/${attributeGroupId}`,
    attributeGroupToReq(attributeFormData),
  );

  return resToAttributeGroup(resp.data);
};

const deleteAttributeGroup = async (attributeGroupId: string): Promise<AttributeGroup> => {
  const resp = await api.delete(`/beneficiary-attribute/groups/${attributeGroupId}`);
  return resToAttributeGroup(resp.data);
};

//
// GET hooks
//

export const useAttributeGroups = ({ currentPage, pageSize, sortBy, sortDirection, debouncedSearch }: any) => {
  return useQuery([QueryKeys.AttributeGroups, currentPage, pageSize, sortBy, sortDirection, debouncedSearch], () =>
    fetchAttributeGroups({ page: currentPage, pageSize, sortBy, sortDirection, search: debouncedSearch }),
  );
};

export const useAttributeGroup = ({ id, queryEnabled }: { id: string; queryEnabled: boolean }) => {
  const { onSetCollectionNotFound } = useGlobalErrors();

  return useQuery([QueryKeys.SingleAttributeGroup, id], () => fetchAttributeGroup(id), {
    onError: () => onSetCollectionNotFound(true),
    enabled: queryEnabled,
  });
};

//
// Mutation hooks
//

export const useAttributeGroupsMutation = () => {
  const queryClient = useQueryClient();

  return {
    createAttributeGroup: useMutation(postAttributeGroup, {
      onSuccess: () => queryClient.invalidateQueries([QueryKeys.AttributeGroups]),
    }),
    editAttributeGroup: useMutation(patchAttributeGroup, {
      onSuccess: () => queryClient.invalidateQueries([QueryKeys.AttributeGroups]),
    }),
    reorderAttributeGroups: useMutation(postReorderAttributeGroups, {
      onSuccess: () => queryClient.invalidateQueries([QueryKeys.AttributeGroups]),
    }),
    removeAttributeGroup: useMutation(deleteAttributeGroup, {
      onSuccess: () => queryClient.invalidateQueries([QueryKeys.AttributeGroups]),
    }),
  };
};

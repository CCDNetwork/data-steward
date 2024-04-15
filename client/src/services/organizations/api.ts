import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/services/api';
import {
  Organization,
  OrganizationMeRequestPayload,
  resToOrganization,
  organizationMeToReq,
  organizationToReq,
} from '@/services/organizations';
import { DataWithMeta, PaginationRequest, paginationRequestToUrl } from '@/helpers/pagination';
import { useGlobalErrors } from '@/providers/GlobalProvider';
import { OrganizationEditFormData } from '@/modules/Organizations/OrganizationPage/validations';

enum QueryKeys {
  Organizations = 'organizations',
  Organization = 'organization',
}

export const fetchOrganizations = async (pagination: PaginationRequest): Promise<DataWithMeta<Organization>> => {
  const url = paginationRequestToUrl('organizations', pagination);

  const resp = await api.get(url);
  return {
    meta: resp.data.meta,
    data: resp.data.data?.map(resToOrganization) ?? [],
  };
};

const fetchOrganization = async (id: string): Promise<Organization> => {
  const resp = await api.get(`/organizations/${id}`);
  return resToOrganization(resp.data);
};

const putOrganization = async ({
  payload,
  organizationId,
}: {
  payload: OrganizationEditFormData;
  organizationId: string;
}): Promise<Organization> => {
  const resp = await api.put(`/organizations/${organizationId}`, organizationToReq(payload));
  return resToOrganization(resp.data);
};

const fetchOrganizationMe = async (): Promise<Organization> => {
  const resp = await api.get('/organizations/me');
  return resToOrganization(resp.data);
};

const postOrganization = async (data: { name: string }): Promise<Organization> => {
  const resp = await api.post('/organizations', organizationToReq(data));
  return resToOrganization(resp.data);
};

const putOrganizationMe = async (data: OrganizationMeRequestPayload): Promise<Organization> => {
  const resp = await api.put('/organizations/me', organizationMeToReq(data));
  return resToOrganization(resp.data);
};

export const useOrganizationMe = ({ queryEnabled = false }: { queryEnabled: boolean }) => {
  return useQuery([QueryKeys.Organization], fetchOrganizationMe, { enabled: queryEnabled });
};

const deleteOrganization = async (id: string): Promise<Organization> => {
  const resp = await api.delete(`/organizations/${id}`);
  return resToOrganization(resp.data);
};

//
// GET HOOKS
//

export const useOrganizations = ({ currentPage, pageSize, sortBy, sortDirection, debouncedSearch }: any) => {
  return useQuery([QueryKeys.Organizations, currentPage, pageSize, sortBy, sortDirection, debouncedSearch], () =>
    fetchOrganizations({ page: currentPage, pageSize, sortBy, sortDirection, search: debouncedSearch }),
  );
};

export const useOrganization = ({ id, isCreate }: { id: string; isCreate: boolean }) => {
  const { onSetCollectionNotFound } = useGlobalErrors();

  return useQuery([QueryKeys.Organization, id], () => fetchOrganization(id), {
    enabled: !isCreate,
    onError: () => onSetCollectionNotFound(true),
  });
};

//
// Query Mutation hooks
//
export const useOrganizationMutation = () => {
  const queryClient = useQueryClient();

  return {
    editOrganizationMe: useMutation(putOrganizationMe, {
      onSuccess: () => queryClient.invalidateQueries([QueryKeys.Organizations]),
    }),
    editOrganization: useMutation(putOrganization, {
      onSuccess: () => queryClient.invalidateQueries([QueryKeys.Organizations]),
    }),
    addOrganization: useMutation(postOrganization, {
      onSuccess: () => queryClient.invalidateQueries([QueryKeys.Organizations]),
    }),
    deleteOrganization: useMutation(deleteOrganization, {
      onSuccess: () => queryClient.invalidateQueries([QueryKeys.Organizations]),
    }),
  };
};

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/services/api';
import {
  Organization,
  OrganizationMeRequestPayload,
  resToOrganization,
  organizationMeToReq,
} from '@/services/organizations';

enum QueryKeys {
  Organization = 'organization',
}

const fetchOrganizationMe = async (): Promise<Organization> => {
  const resp = await api.get('/organizations/me');
  return resToOrganization(resp.data);
};

const putOrganizationMe = async (data: OrganizationMeRequestPayload): Promise<Organization> => {
  const resp = await api.put('/organizations/me', organizationMeToReq(data));
  return resToOrganization(resp.data);
};

export const useOrganizationMe = ({ queryEnabled = false }: { queryEnabled: boolean }) => {
  return useQuery([QueryKeys.Organization], fetchOrganizationMe, { enabled: queryEnabled });
};

//
// Query Mutation hooks
//
export const useOrganizationMutation = () => {
  const queryClient = useQueryClient();

  return {
    editOrganizationMe: useMutation(putOrganizationMe, {
      onSuccess: () => queryClient.invalidateQueries([QueryKeys.Organization]),
    }),
  };
};

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/services/api';
import { Tenant, TenantMeRequestPayload, resToTenant, tenantMeToReq } from '@/services/tenants';

enum QueryKeys {
  TenantMe = 'tenant_me',
}

const fetchTenantMe = async (): Promise<Tenant> => {
  const resp = await api.get('/tenants/me');
  return resToTenant(resp.data);
};

const putTenantMe = async (data: TenantMeRequestPayload): Promise<Tenant> => {
  const resp = await api.put('/tenants/me', tenantMeToReq(data));
  return resToTenant(resp.data);
};

export const useTenantMe = ({ queryEnabled = false }: { queryEnabled: boolean }) => {
  return useQuery([QueryKeys.TenantMe], fetchTenantMe, { enabled: queryEnabled });
};

//
// Query Mutation hooks
//
export const useTenantMutation = () => {
  const queryClient = useQueryClient();

  return {
    editTenantMe: useMutation(putTenantMe, {
      onSuccess: () => queryClient.invalidateQueries([QueryKeys.TenantMe]),
    }),
  };
};

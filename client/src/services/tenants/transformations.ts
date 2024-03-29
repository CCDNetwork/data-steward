import { Tenant } from '@/services/tenants';

export const resToTenant = (res: any): Tenant => {
  return {
    id: res.id ?? '',
    name: res.name ?? '',
    role: res.role ?? null,
  };
};

export const tenantMeToReq = (data: any): Omit<Tenant, 'id'> => {
  const req: any = {
    name: data.name ?? '',
  };

  return req;
};

export interface Tenant {
  id: string;
  name: string;
  role: string;
}

export interface TenantMeRequestPayload {
  name: string;
}

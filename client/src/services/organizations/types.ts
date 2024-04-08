export interface Organization {
  id: string;
  name: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface OrganizationMeRequestPayload {
  name: string;
}

export interface OrganizationActivity {
  id: string;
  title: string;
  serviceType: string;
}

export interface Organization {
  id: string;
  name: string;
  isMpcaActive: boolean;
  isWashActive: boolean;
  isShelterActive: boolean;
  activities: OrganizationActivity[];
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface OrganizationMeRequestPayload {
  name: string;
}

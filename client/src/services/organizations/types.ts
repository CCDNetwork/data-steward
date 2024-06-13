export interface OrganizationActivities {
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
  activities: OrganizationActivities[];
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface OrganizationMeRequestPayload {
  name: string;
}

import { Organization } from './types';

export enum OrgActivity {
  Mpca = 'mpca',
  Wash = 'wash',
  Shelter = 'shelter',
  FoodAssistance = 'foodAssistance',
  Livelihoods = 'livelihoods',
  Protection = 'protection',
}

export enum OrgActivityFilterMap {
  MPCA = 'mpca',
  WASH = 'wash',
  Shelter = 'shelter',
  'Food Assistance' = 'foodAssistance',
  Livelihoods = 'livelihoods',
  Protection = 'protection',
}

export const initialOrganization: Organization = {
  id: '',
  isFoodAssistanceActive: false,
  isLivelihoodsActive: false,
  isMpcaActive: false,
  isProtectionActive: false,
  isShelterActive: false,
  isWashActive: false,
  name: '',
  updatedAt: null,
  createdAt: null,
  activities: [],
};

import { AdminLevel1, AdminLevel2 } from './types';

export const resToAdminLevel1 = (res: any): AdminLevel1 => {
  return {
    id: res.id ?? 0,
    locationRef: res.location_ref ?? 0,
    code: res.code ?? '',
    name: res.name ?? '',
    locationCode: res.location_code ?? '',
    locationName: res.location_name ?? '',
  };
};

export const resToAdminLevel2 = (res: any): AdminLevel2 => {
  return {
    id: res.id ?? 0,
    locationRef: res.location_ref ?? 0,
    code: res.code ?? '',
    name: res.name ?? '',
    locationCode: res.location_code ?? '',
    locationName: res.location_name ?? '',
    admin1Ref: res.admin1_ref ?? 0,
    admin1Code: res.admin1_code ?? '',
    admin1Name: res.admin1_name ?? '',
  };
};

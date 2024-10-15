import { AdministrativeRegion } from './types';

export const resToAdministrativeRegion = (res: any): AdministrativeRegion => {
  return {
    id: res.id ?? '',
    parentId: res.parentId ?? '',
    code: res.code ?? '',
    level: res.level ?? 0,
    name: res.name ?? '',
    path: res.path ?? '',
  };
};

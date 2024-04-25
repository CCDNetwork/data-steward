import { resToUser } from '../users';

import { Template } from './types';

export const resToTemplate = (res: any): Template => {
  return {
    id: res.id ?? '',
    name: res.name ?? '',
    firstName: res.firstName ?? '',
    familyName: res.familyName ?? '',
    gender: res.gender ?? '',
    dateofBirth: res.dateofBirth ?? '',
    hhid: res.hhid ?? '',
    mobilePhoneID: res.mobilePhoneID ?? '',
    govIDType: res.govIDType ?? '',
    govIDNumber: res.govIDNumber ?? '',
    otherIDType: res.otherIDType ?? '',
    otherIDNumber: res.otherIDNumber ?? '',
    assistanceDetails: res.assistanceDetails ?? '',
    activity: res.activity ?? '',
    currency: res.currency ?? '',
    currencyAmount: res.currencyAmount ?? '',
    startDate: res.startDate ?? '',
    endDate: res.endDate ?? '',
    frequency: res.frequency ?? '',
    adminLevel1: res.adminLevel1 ?? '',
    adminLevel2: res.adminLevel2 ?? '',
    adminLevel3: res.adminLevel3 ?? '',
    adminLevel4: res.adminLevel4 ?? '',
    userCreated: res.userCreated ? resToUser(res.userCreated) : null,
    createdAt: res.createdAt ? new Date(res.createdAt) : null,
    updatedAt: res.updatedAt ? new Date(res.updatedAt) : null,
  };
};

export const templateToReq = (data: any): Omit<Template, 'id' | 'userCreated' | 'createdAt' | 'updatedAt'> => {
  const req: any = {
    name: data.name,
    firstName: data.firstName,
    familyName: data.familyName,
    gender: data.gender,
    dateofBirth: data.dateofBirth,
    hhid: data.hhid,
    mobilePhoneID: data.mobilePhoneID,
    govIDType: data.govIDType,
    govIDNumber: data.govIDNumber,
    otherIDType: data.otherIDType,
    otherIDNumber: data.otherIDNumber,
    assistanceDetails: data.assistanceDetails,
    activity: data.activity,
    currency: data.currency,
    currencyAmount: data.currencyAmount,
    startDate: data.startDate,
    endDate: data.endDate,
    frequency: data.frequency,
    adminLevel1: data.adminLevel1,
    adminLevel2: data.adminLevel2,
    adminLevel3: data.adminLevel3,
    adminLevel4: data.adminLevel4,
  };

  return req;
};

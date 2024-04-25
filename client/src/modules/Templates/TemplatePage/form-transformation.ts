import { Template } from '@/services/templates';

import { TemplateForm } from '../validation';

export const dataToTemplateEditForm = (data: Template): TemplateForm => {
  return {
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
};

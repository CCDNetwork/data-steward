import { resToOrganization } from '../organizations';
import { resToUser } from '../users';
import { Beneficiary } from './types';

export const resToBeneficiary = (res: any): Beneficiary => {
  return {
    id: res.id ?? '',
    firstName: res.firstName ?? '',
    familyName: res.familyName ?? '',
    gender: res.gender ?? '',
    dateOfBirth: res.dateOfBirth ?? '',
    communityId: res.communityId ?? '',
    hhId: res.hhId ?? '',
    mobilePhoneId: res.mobilePhoneId ?? '',
    govIdType: res.govIdType ?? '',
    govIdNumber: res.govIdNumber ?? '',
    otherIdType: res.otherIdType ?? '',
    otherIdNumber: res.otherIdNumber ?? '',
    assistanceDetails: res.assistanceDetails ?? '',
    activity: res.activity ?? '',
    currency: res.currency ?? '',
    currencyAmount: res.currencyAmount ?? '',
    startDate: res.startDate ?? '',
    endDate: res.endDate ?? '',
    frequency: res.frequency ?? '',
    isPrimary: res.isPrimary ?? false,
    status: res.status ?? '',
    createdAt: res.createdAt ? new Date(res.createdAt) : null,
    updatedAt: res.updatedAt ? new Date(res.updatedAt) : null,
    adminLevel1: res.adminLevel1 ?? '',
    adminLevel2: res.adminLevel2 ?? '',
    adminLevel3: res.adminLevel3 ?? '',
    adminLevel4: res.adminLevel4 ?? '',
    matchedFields: res.matchedFields ?? [],
    pointOfContact: res.pointOfContact ? resToUser(res.pointOfContact) : null,
    uploadedBy: res.uploadedBy ? resToUser(res.uploadedBy) : null,
    organization: res.organization ? resToOrganization(res.organization) : null,
    duplicates: res.duplicates ? res.duplicates.map(resToBeneficiary) : [],
  };
};

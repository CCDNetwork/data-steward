import { resToBeneficiaryAttribute } from '../beneficiaryAttribute/transformations';
import { AttributeGroup } from './types';

export const resToAttributeGroup = (res: any): AttributeGroup => {
  return {
    id: res.id ?? '',
    name: res.name ?? '',
    order: res.order ?? 0,
    isActive: res.isActive ?? false,
    useFuzzyMatch: res.useFuzzyMatch ?? false,
    beneficiaryAttributes: res.beneficiaryAttributes
      ? res.beneficiaryAttributes.map(resToBeneficiaryAttribute)
      : [],
    organizationId: res.organizationId ?? '',
    createdAt: res.createdAt ? new Date(res.createdAt) : null,
    updatedAt: res.updatedAt ? new Date(res.updatedAt) : null,
  };
};

export const attributeGroupToReq = (
  data: any,
): Omit<AttributeGroup, 'id' | 'createdAt' | 'updatedAt'> => {
  const req: any = {
    title: data.title,
    name: data.name,
    isActive: data.isActive,
    useFuzzyMatch: data.useFuzzyMatch,
    beneficiaryAttributeIds: data.beneficiaryAttributeIds,
  };

  return req;
};

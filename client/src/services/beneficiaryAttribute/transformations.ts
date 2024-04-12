import { BeneficiaryAttribute } from './types';

export const resToBeneficiaryAttribute = (res: any): BeneficiaryAttribute => {
  return {
    id: res.id ?? 0,
    name: res.name ?? '',
    type: res.type ?? '',
    usedForDeduplication: res.usedForDeduplication ?? false,
  };
};

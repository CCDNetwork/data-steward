import { resToBeneficiary } from '@/services/beneficiaryList/transformations';
import { BeneficiaryData } from './types';
import { resToReferral } from '@/services/referrals';

export const resToBeneficiaryData = (res: any): BeneficiaryData => {
  return {
    duplicateBeneficiaryData: res.beneficiary
      ? resToBeneficiary(res.beneficiary)
      : null,
    referralData: res.referral ? resToReferral(res.referral) : null,
  };
};

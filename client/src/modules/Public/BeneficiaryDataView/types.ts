import { Beneficiary } from '@/services/beneficiaryList';
import { Referral } from '@/services/referrals';

export type BeneficiaryData = {
  referralData: Referral | null;
  duplicateBeneficiaryData: Beneficiary | null;
};

import axios from 'axios';

import { Referral, resToReferral } from '@/services/referrals';

export const fetchPendingReferral = async (caseNumber: string): Promise<Referral> => {
  const resp = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/referrals/${caseNumber}/case-number`);

  return resToReferral(resp.data);
};

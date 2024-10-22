import axios from 'axios';

import { BeneficiaryData } from './types';

export const fetchBeneficiaryData = async (
  taxId: string
): Promise<BeneficiaryData> => {
  const resp = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/v1/beneficiary-data/${taxId}`
  );

  return resp.data;
};

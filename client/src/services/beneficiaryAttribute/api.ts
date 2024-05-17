import { api } from '@/services';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { resToBeneficiaryAttribute } from './transformations';
import { BeneficiaryAttribute, BeneficiaryAttributePatchPayload } from './types';

enum QueryKeys {
  BeneficiaryAttributes = 'beneficiary-attributes',
}

const fetchBeneficiaryAttributes = async (): Promise<BeneficiaryAttribute[]> => {
  const resp = await api.get('/beneficiary-attribute');
  return resp.data.map(resToBeneficiaryAttribute);
};

export const patchBeneficiaryAttribute = async ({
  id,
  usedForDeduplication,
}: BeneficiaryAttributePatchPayload): Promise<BeneficiaryAttribute> => {
  const resp = await api.patch(`beneficiary-attribute/${id}`, { usedForDeduplication });
  return resToBeneficiaryAttribute(resp.data);
};

// query
export const useBeneficiaryAttributes = ({ queryEnabled }: { queryEnabled?: boolean } = { queryEnabled: false }) => {
  return useQuery([QueryKeys.BeneficiaryAttributes], () => fetchBeneficiaryAttributes(), {
    enabled: queryEnabled,
  });
};

//
// Mutation hooks
//
export const useBeneficiaryAttributesMutation = () => {
  const queryClient = useQueryClient();

  return {
    toggleDeduplication: useMutation(patchBeneficiaryAttribute, {
      onSuccess: () => queryClient.invalidateQueries([QueryKeys.BeneficiaryAttributes]),
    }),
  };
};

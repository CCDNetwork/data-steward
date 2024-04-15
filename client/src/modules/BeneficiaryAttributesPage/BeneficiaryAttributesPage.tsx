import { DataTable } from '@/components/DataTable';
import { PageContainer } from '@/components/PageContainer';
import {
  BeneficiaryAttribute,
  useBeneficiaryAttributes,
  useBeneficiaryAttributesMutation,
} from '@/services/beneficiaryAttribute';

import { columns } from './columns';
import { toast } from '@/components/ui/use-toast';

export const BeneficiaryAttributesPage = () => {
  const { data: beneficiaryAttributes } = useBeneficiaryAttributes();
  const { toggleDeduplication } = useBeneficiaryAttributesMutation();

  const onDeduplicationToggleClick = async ({ id, usedForDeduplication }: BeneficiaryAttribute) => {
    try {
      const { name } = await toggleDeduplication.mutateAsync({ id, usedForDeduplication: !usedForDeduplication });
      toast({
        title: 'Success!',
        variant: 'default',
        description: `"${name}" set ${usedForDeduplication ? 'to NOT be' : 'to be'} used for deduplication`,
      });
    } catch (error: any) {
      toast({
        title: 'An error has occured!',
        variant: 'destructive',
        description: error.response?.data?.errorMessage || 'Something went wrong',
      });
    }
  };

  return (
    <PageContainer pageTitle="Beneficiary Attributes">
      <DataTable
        data={beneficiaryAttributes ?? []}
        isQueryLoading={false}
        columns={columns(onDeduplicationToggleClick)}
      />
    </PageContainer>
  );
};

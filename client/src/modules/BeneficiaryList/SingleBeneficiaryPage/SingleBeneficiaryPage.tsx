import { useMemo } from 'react';

import { PageContainer } from '@/components/PageContainer';
import { APP_ROUTE } from '@/helpers/constants';
import { useBeneficiary } from '@/services/beneficiaryList';
import { useIdFromParams } from '@/helpers/common';

import { dataToDuplicateBeneficiaryValues } from './transformations';

export const SingleBeneficiaryPage = () => {
  const { id: beneficiaryId } = useIdFromParams();

  const { data: beneficiaryData, isLoading } = useBeneficiary({ id: beneficiaryId });

  const duplicateBeneficiaryValues = useMemo(() => {
    if (beneficiaryData) {
      const referralData = dataToDuplicateBeneficiaryValues(beneficiaryData);
      return referralData;
    }
  }, [beneficiaryData]);

  return (
    <PageContainer
      pageTitle="Beneficiary Preview"
      pageSubtitle="Duplicate beneficiary details"
      isLoading={isLoading}
      breadcrumbs={[
        { href: `${APP_ROUTE.BeneficiaryList}`, name: 'Beneficiary List' },
        { name: 'Beneficiary Preview' },
      ]}
    >
      <div className="flex flex-col max-w-[500px] !mt-6">
        <div className="border">
          {duplicateBeneficiaryValues &&
            Object.entries(duplicateBeneficiaryValues).map(([key, value], idx) => {
              if (!value) return;
              return (
                <div className="!m-0 flex flex-row border-b last:border-b-0 py-2 px-3 justify-between" key={idx}>
                  {!!value && <div>{key}</div>}
                  <div>{value}</div>
                </div>
              );
            })}
        </div>
      </div>
    </PageContainer>
  );
};

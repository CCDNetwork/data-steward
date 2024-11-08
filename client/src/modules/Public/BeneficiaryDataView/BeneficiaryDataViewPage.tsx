import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PublicPage } from '@/layouts/PublicPage';
import { toast } from '@/components/ui/use-toast';

import { fetchBeneficiaryData } from './api';
import { BeneficiaryData } from './types';
import { formatDate } from 'date-fns';
import { Referral } from '@/services/referrals';
import { Beneficiary } from '@/services/beneficiaryList';

export const BeneficiaryDataViewPage = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [beneficiaryData, setBeneficiaryData] =
    useState<BeneficiaryData | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = async () => {
    if (!inputValue) {
      inputRef.current?.focus();
      return;
    }
    setIsLoading(true);
    try {
      const beneficiaryData = await fetchBeneficiaryData(inputValue);
      setBeneficiaryData(beneficiaryData);
      setInputValue('');
    } catch (error: any) {
      inputRef.current?.focus();
      toast({
        title: 'An error has occured!',
        variant: 'destructive',
        description:
          error.response?.data?.errorMessage || 'Something went wrong',
      });
    }
    setIsLoading(false);
  };

  if (beneficiaryData) {
    const referralData = beneficiaryData.referralData;
    const deduplicationBeneficiaryData =
      beneficiaryData.duplicateBeneficiaryData;
    const referralOrgHoldingData =
      referralData?.organizationCreated?.name ?? '';
    const beneficiaryOrgHoldingData =
      deduplicationBeneficiaryData?.uploadedBy?.organizations[0].name ?? '';

    const referralObjKeysToDisplay: Array<
      keyof Pick<
        Referral,
        | 'firstName'
        | 'patronymicName'
        | 'surname'
        | 'dateOfBirth'
        | 'gender'
        | 'taxId'
        | 'address'
        | 'email'
        | 'phone'
      >
    > = [
      'firstName',
      'patronymicName',
      'surname',
      'dateOfBirth',
      'gender',
      'taxId',
      'address',
      'email',
      'phone',
    ];

    const beneficiaryObjKeysToDisplay: Array<
      keyof Omit<
        Beneficiary,
        | 'id'
        | 'isPrimary'
        | 'createdAt'
        | 'updatedAt'
        | 'matchedFields'
        | 'pointOfContact'
        | 'uploadedBy'
        | 'organization'
        | 'duplicates'
      >
    > = [
      'activity',
      'adminLevel1',
      'adminLevel2',
      'adminLevel3',
      'adminLevel4',
      'assistanceDetails',
      'currency',
      'currencyAmount',
      'dateOfBirth',
      'endDate',
      'familyName',
      'firstName',
      'frequency',
      'gender',
      'otherIdNumber',
      'govIdType',
      'hhId',
      'mobilePhoneId',
      'otherIdNumber',
      'otherIdType',
      'startDate',
      'status',
    ];

    return (
      <div className="w-full py-8">
        <div className="flex flex-col gap-4 items-center mx-auto justify-center h-full max-w-[500px]">
          <h1 className="text-center font-medium text-md">
            The platform currently holds the following data related to Tax ID:{' '}
            <code>{beneficiaryData.referralData?.taxId}</code>
          </h1>
          <div className="flex flex-col gap-4 w-full">
            {referralData && (
              <div className="bg-muted/80 sm:px-8 sm:py-4 px-4 py-2  border rounded-2xl flex-1">
                <div className="text-center text-muted-foreground pb-4">
                  <h1 className="text-xl font-medium">Referral Data</h1>
                  <p className="text-sm">held by</p>
                  <code className="text-sm">{referralOrgHoldingData}</code>
                </div>
                <>
                  {referralObjKeysToDisplay.map(
                    (i) =>
                      !!referralData[i] && (
                        <div
                          key={i}
                          className="flex w-full justify-between border-b py-2 text-sm"
                        >
                          <span className="capitalize font-medium">
                            {i.replace(/([A-Z])/g, ' $1')}
                          </span>
                          <span>
                            {i === 'dateOfBirth'
                              ? formatDate(referralData[i], 'dd/MM/yyyy')
                              : referralData[i]}
                          </span>
                        </div>
                      )
                  )}
                </>
              </div>
            )}
            {deduplicationBeneficiaryData && (
              <div className="bg-muted/80 sm:px-8 sm:py-4 px-4 py-2 border rounded-2xl flex-1">
                <div className="text-center text-muted-foreground pb-4">
                  <h1 className="text-xl font-medium"> Beneficiary Data</h1>
                  <p className="text-sm">held by</p>
                  <code className="text-sm">{beneficiaryOrgHoldingData}</code>
                </div>
                <>
                  {beneficiaryObjKeysToDisplay.map(
                    (i) =>
                      !!deduplicationBeneficiaryData[i] && (
                        <div
                          key={i}
                          className="flex w-full justify-between border-b py-2 text-sm"
                        >
                          <span className="capitalize font-medium">
                            {i.replace(/([A-Z])/g, ' $1')}
                          </span>
                          <span>{deduplicationBeneficiaryData[i]}</span>
                        </div>
                      )
                  )}
                </>
              </div>
            )}
          </div>
          <Button
            type="button"
            variant="link"
            onClick={() => setBeneficiaryData(null)}
          >
            &larr; Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <PublicPage
      shouldRedirect={false}
      title="Beneficiary Data"
      subtitle="Enter your Tax Id to see your data"
      boxClassName="sm:max-w-[400px]"
    >
      <Input
        id="taxId"
        placeholder="Enter your tax id..."
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        ref={inputRef}
      />
      <Button
        onClick={onSubmit}
        isLoading={isLoading}
        disabled={isLoading}
        type="submit"
        variant="default"
        className="w-full"
      >
        Submit
      </Button>
    </PublicPage>
  );
};

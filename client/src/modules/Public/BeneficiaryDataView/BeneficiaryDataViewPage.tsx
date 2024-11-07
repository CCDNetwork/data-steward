import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PublicPage } from '@/layouts/PublicPage';
import { toast } from '@/components/ui/use-toast';

import { fetchBeneficiaryData } from './api';
import { BeneficiaryData } from './types';
import { formatDate } from 'date-fns';

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
    const availableBeneficiaryData = Object.entries(beneficiaryData).filter(
      ([, value]) => !!value
    );
    return (
      <div className="w-full h-[100svh]">
        <div className="flex flex-col gap-4 items-center mx-auto justify-center h-full max-w-[500px]">
          <h1 className="text-center font-medium text-lg">
            The platform currently holds the following data related to Tax ID:{' '}
            <code>{beneficiaryData.taxId}</code>
          </h1>
          <div className="flex flex-col bg-muted sm:p-10 p-4 border rounded-2xl w-full">
            {availableBeneficiaryData.map(([key, value]) => (
              <div
                key={key}
                className="flex w-full justify-between border-b py-2 text-sm"
              >
                <span className="capitalize font-medium">
                  {key.replace(/([A-Z])/g, ' $1')}:
                </span>
                <span>
                  {key === 'dateOfBirth' && !!value
                    ? formatDate(value, 'dd/MM/yyyy')
                    : value?.toString()}
                </span>
              </div>
            ))}
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

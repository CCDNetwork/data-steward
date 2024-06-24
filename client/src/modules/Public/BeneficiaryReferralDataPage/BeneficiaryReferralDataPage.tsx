import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PublicPage } from '@/layouts/PublicPage';
import { toast } from '@/components/ui/use-toast';
import { Referral } from '@/services/referrals';

import { fetchPendingReferral } from './api';

export const BeneficiaryReferralDataPage = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [referralData, setReferralData] = useState<Referral | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = async () => {
    if (!inputValue) {
      inputRef.current?.focus();
      return;
    }
    setIsLoading(true);
    try {
      const referralData = await fetchPendingReferral(inputValue);

      setReferralData(referralData);
    } catch (error: any) {
      toast({
        title: 'An error has occured!',
        variant: 'destructive',
        description: error.response?.data?.errorMessage || 'Something went wrong',
      });
    }
    setInputValue('');
    setIsLoading(false);
  };

  if (referralData) {
    return (
      <div className="w-screen h-[100svh]">
        <div className="flex flex-col gap-10 items-center mx-auto justify-center h-full max-w-[500px]">
          <div className="flex flex-col gap-6">
            <div className="flex gap-2 flex-col items-center">
              <span className="text-sm text-muted-foreground">Organization created</span>
              <p className="text-xl font-medium">{referralData.organizationCreated?.name || ''}</p>
            </div>
            <div className="flex gap-2 flex-col items-center">
              <span className="text-sm text-muted-foreground">Organization referred to</span>
              <p className="text-xl font-medium">{referralData.organizationReferredTo?.name || ''}</p>
            </div>
            <div className="flex gap-2 flex-col items-center">
              <span className="text-sm text-muted-foreground">Status</span>
              <p className="text-md font-semibold uppercase px-3 py-1 rounded-lg text-white bg-primary">
                {referralData.status || ''}
              </p>
            </div>
          </div>
          <Button type="button" variant="link" onClick={() => setReferralData(null)}>
            &larr; Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <PublicPage
      shouldRedirect={false}
      title="Referral Status"
      subtitle="Enter your referral case number"
      boxClassName="sm:max-w-[400px]"
    >
      <Input
        id="caseNumber"
        placeholder="Enter case number..."
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

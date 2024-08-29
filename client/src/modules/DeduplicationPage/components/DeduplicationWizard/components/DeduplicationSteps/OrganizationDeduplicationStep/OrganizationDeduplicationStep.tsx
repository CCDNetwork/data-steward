import { CheckCircleIcon } from 'lucide-react';

import { SameOrgDedupeResponse } from '@/services/deduplication';

import { StepLoadingComponent } from '../../StepLoadingComponent';

interface Props {
  isStepLoading: boolean;
  stepDeduplicationResponse: SameOrgDedupeResponse | null;
  duplicatesToUpload: number;
}

export const OrganizationDeduplicationStep: React.FC<Props> = ({
  isStepLoading,
  stepDeduplicationResponse,
  duplicatesToUpload,
}) => {
  if (isStepLoading) {
    return (
      <StepLoadingComponent loadingStepText="The platform is checking the uploaded file for organisational duplicates..." />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 text-sm">
      <CheckCircleIcon className="w-16 h-16 text-green-600" />
      <p className="pb-4 text-center">
        Out of the{' '}
        <span className="px-1 border border-border rounded py-0.5 bg-muted font-bold">
          {stepDeduplicationResponse?.totalRecords}
        </span>{' '}
        beneficiary records, the platform has found{' '}
        <span className="px-1 border border-border rounded py-0.5 bg-muted font-bold">
          {stepDeduplicationResponse?.identicalRecords}
        </span>{' '}
        identical records,{' '}
        <span className="px-1 border border-border rounded py-0.5 bg-muted font-bold">
          {stepDeduplicationResponse?.potentialDuplicateRecords}
        </span>{' '}
        potential duplicates and will upload{' '}
        <span className="px-1 border border-border rounded py-0.5 bg-muted font-bold">
          {duplicatesToUpload}
        </span>{' '}
        new beneficiaries.
      </p>
      {duplicatesToUpload === 0 ? (
        <p className="font-medium">
          Since there are no new beneficiaries to be added, the wizard will now
          exit. No new beneficiaries will be added to the platform.
        </p>
      ) : (
        <p>
          Next, we will add your data to the registry and check for potential
          duplicates with other organisations’ records.
        </p>
      )}
    </div>
  );
};

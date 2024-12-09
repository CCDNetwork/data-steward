import { AlertTriangle, CheckCircleIcon } from 'lucide-react';

import {
  DeduplicationDataset,
  SystemOrgDedupeResponse,
} from '@/services/deduplication';
import { StepLoadingComponent } from '../../StepLoadingComponent/StepLoadingComponent';

interface Props {
  isStepLoading: boolean;
  stepDeduplicationResponse: SystemOrgDedupeResponse | null;
  commcareDedupResponse: DeduplicationDataset | null;
}

export const RegistryDeduplicationStep: React.FC<Props> = ({
  isStepLoading,
  stepDeduplicationResponse,
  commcareDedupResponse,
}) => {
  if (isStepLoading) {
    return (
      <StepLoadingComponent loadingStepText="The platform is adding the uploaded data to the registry and checking for duplicates..." />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 text-sm">
      {!stepDeduplicationResponse?.duplicates ? (
        <>
          <CheckCircleIcon className="w-16 h-16 text-green-600" />
          <p className="pb-4">
            The platform has found no duplicates in the registry.
          </p>
          <p>
            Your beneficiary data has been successfully added to the registry.
          </p>
        </>
      ) : (
        <>
          <AlertTriangle className="w-16 h-16 text-yellow-500" />
          <p className="text-sm">
            The platform has found
            <span className="mx-1 px-1 border border-border rounded py-0.5 bg-muted font-bold">
              {stepDeduplicationResponse.duplicates}
            </span>
            potential duplicates between your upload and the registry.
          </p>
          <p className="text-center">
            {
              'You can view and manage these duplicates on the "Manage Duplicates" page.'
            }
          </p>
        </>
      )}
      <div className="pt-4 flex-col flex justify-center gap-2">
        <p>
          We have also performed a deduplication check against Commcare registry
          and found
          <span className="mx-1 px-1 border border-border rounded py-0.5 bg-muted font-bold">
            {commcareDedupResponse?.duplicates}
          </span>
          potential duplicates
        </p>

        {!stepDeduplicationResponse?.duplicates ? (
          <p className="text-muted-foreground text-center pt-2">
            Finish the wizard to import the beneficiaries.
          </p>
        ) : (
          <p className="text-muted-foreground text-center py-2">
            This concludes the upload wizard
          </p>
        )}
      </div>
    </div>
  );
};

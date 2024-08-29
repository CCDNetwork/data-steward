import { AlertTriangle, CheckCircleIcon } from 'lucide-react';

import { SystemOrgDedupeResponse } from '@/services/deduplication';
import { StepLoadingComponent } from '../../StepLoadingComponent';

interface Props {
  isStepLoading: boolean;
  stepDeduplicationResponse: SystemOrgDedupeResponse | null;
}

export const RegistryDeduplicationStep: React.FC<Props> = ({
  isStepLoading,
  stepDeduplicationResponse,
}) => {
  if (isStepLoading) {
    return (
      <StepLoadingComponent loadingStepText="The platform is adding the uploaded data to the registry and checking for duplicates..." />
    );
  }

  return !stepDeduplicationResponse?.duplicates ? (
    <div className="flex flex-col items-center justify-center gap-4 text-sm">
      <CheckCircleIcon className="w-16 h-16 text-green-600" />
      <p className="pb-4">
        The platform has found no duplicates in the registry.
      </p>
      <p>Your beneficiary data has been successfully added to the registry.</p>
      <p className="text-muted-foreground">
        Finish the wizard to import the beneficiaries.
      </p>
    </div>
  ) : (
    <div className="flex flex-col text-sm items-center justify-center gap-4">
      <AlertTriangle className="w-16 h-16 text-yellow-500" />
      <p className="text-sm">
        The platform has found{' '}
        <span className="px-1 border border-border rounded py-0.5 bg-muted font-bold">
          {stepDeduplicationResponse.duplicates}
        </span>
        potential duplicates between your upload and the registry.
      </p>
      <p className="text-center">
        {
          'You can view and manage these duplicates on the "Manage Duplicates" page.'
        }
      </p>
      <p className="text-muted-foreground">This concludes the upload wizard</p>
    </div>
  );
};

import React, { useMemo } from 'react';
import { CheckCircle2, XCircleIcon } from 'lucide-react';
import { BENEFICIARY_STATUS, BeneficiaryListStatus } from './const';

interface BeneficiaryStatusProps {
  currentStatus: string;
}

export const BeneficiaryStatus: React.FC<BeneficiaryStatusProps> = ({ currentStatus }) => {
  const statusIcon = useMemo(() => {
    switch (currentStatus) {
      case BENEFICIARY_STATUS.AcceptedDuplicate:
        return (
          <div className="w-8 h-8 rounded-full flex relative items-center justify-center bg-yellow-500">
            <CheckCircle2 className="text-white/80" />
            <p className="absolute uppercase text-[11px] top-9 font-medium tracking-tighter text-black dark:text-white whitespace-nowrap">
              {BeneficiaryListStatus[currentStatus]}
            </p>
          </div>
        );
      case BENEFICIARY_STATUS.NotDuplicate:
        return (
          <div className="w-8 h-8 rounded-full flex relative items-center justify-center bg-green-600">
            <CheckCircle2 className="text-white/80" />
            <p className="absolute uppercase text-[11px] top-9 font-medium tracking-tighter text-black dark:text-white whitespace-nowrap">
              {BeneficiaryListStatus[currentStatus]}
            </p>
          </div>
        );
      case BENEFICIARY_STATUS.RejectedDuplicate:
        return (
          <div className="w-8 h-8 rounded-full flex relative items-center justify-center bg-red-600">
            <XCircleIcon className="text-white/80" />
            <p className="absolute uppercase text-[11px] top-9 font-medium tracking-tighter text-black dark:text-white whitespace-nowrap">
              {BeneficiaryListStatus[currentStatus]}
            </p>
          </div>
        );
      default:
        return 'Status not available';
    }
  }, [currentStatus]);

  return <div className="flex items-center py-2">{statusIcon}</div>;
};

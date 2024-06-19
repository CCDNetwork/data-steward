import React from 'react';
import { CheckCircle2, CircleDot, XCircleIcon } from 'lucide-react';

import { ReferralStatus } from '@/services/referrals/const';
import { cn } from '@/helpers/utils';

import { Separator } from '../ui/separator';

interface TimelineProps {
  currentStatus: string;
}

export const StatusTimeline: React.FC<TimelineProps> = ({ currentStatus }) => {
  const referralStatusesList = [...Object.values(ReferralStatus)].filter((i) => {
    if (currentStatus === ReferralStatus.Withdrawn) {
      return i !== ReferralStatus.Rejected && i !== ReferralStatus.Enrolled;
    }

    if (currentStatus === ReferralStatus.Rejected) {
      return i !== ReferralStatus.Withdrawn && i !== ReferralStatus.Enrolled;
    }

    return i !== ReferralStatus.Rejected && i !== ReferralStatus.Withdrawn;
  });

  const currentStatusIndex = referralStatusesList.indexOf(currentStatus);

  return (
    <div className="flex items-center gap-2 py-2">
      {referralStatusesList.map((status, index) => (
        <React.Fragment key={status}>
          <div className={cn('flex flex-col items-center', { 'opacity-50': status !== currentStatus })}>
            <div
              className={cn('w-8 h-8 rounded-full flex relative items-center justify-center bg-primary', {
                'bg-green-600': status === ReferralStatus.Enrolled,
                'bg-yellow-500': status === ReferralStatus.InEvaluation,
                'bg-orange-500': status === ReferralStatus.Withdrawn,
                'bg-red-600': status === ReferralStatus.Rejected,
                'bg-muted-foreground': index > currentStatusIndex,
              })}
            >
              {index <= currentStatusIndex ? (
                status === ReferralStatus.Withdrawn || status === ReferralStatus.Rejected ? (
                  <XCircleIcon className="text-white/80" />
                ) : (
                  <CheckCircle2 className="text-white/80" />
                )
              ) : (
                <CircleDot className="text-white/80" />
              )}
              <p
                className={cn(
                  'absolute uppercase text-[11px] top-9 font-medium tracking-tighter text-muted-foreground whitespace-nowrap',
                  { 'text-black dark:text-white': status === currentStatus },
                )}
              >
                {status === ReferralStatus.InEvaluation ? 'In Evaluation' : status}
              </p>
            </div>
          </div>
          {index < referralStatusesList.length - 1 && (
            <Separator
              className={cn('w-14 border-muted-foreground/60 rounded-xl border', {
                'border-border': index >= currentStatusIndex,
              })}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

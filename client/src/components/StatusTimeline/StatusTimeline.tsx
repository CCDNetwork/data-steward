import React from 'react';
import { Check, EllipsisIcon, PlayIcon, XIcon } from 'lucide-react';

import { ReferralStatus } from '@/services/referrals/const';
import { cn } from '@/helpers/utils';

import { Separator } from '../ui/separator';

interface TimelineProps {
  currentStatus: string;
  isRejected: boolean;
}

export const StatusTimeline: React.FC<TimelineProps> = ({
  currentStatus,
  isRejected,
}) => {
  const referralStatusesList = [...Object.values(ReferralStatus)];

  const currentStatusIndex = referralStatusesList.indexOf(currentStatus);

  return (
    <div className="flex items-center gap-2 py-2">
      {referralStatusesList.map((status, index) => (
        <React.Fragment key={status}>
          <div className={cn('flex flex-col items-center')}>
            <div
              className={cn(
                'w-8 h-8 rounded-full flex relative items-center justify-center',
                {
                  'bg-background': index > currentStatusIndex,
                }
              )}
            >
              {index < currentStatusIndex && (
                <Check className="w-full h-full rounded-full bg-green-900/20 border border-green-800 p-1.5 text-green-800" />
              )}

              {index === currentStatusIndex &&
                (isRejected ? (
                  <XIcon className="w-full h-full rounded-full bg-red-900/20 border border-red-800 p-1.5 text-muted-foreground text-red-800" />
                ) : (
                  <div className="w-full h-full flex justify-center items-center rounded-full border border-yellow-500 bg-yellow-500/20">
                    <span className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center">
                      <PlayIcon className="p-1.5 text-yellow-100 fill-yellow-100" />
                    </span>
                  </div>
                ))}

              {index > currentStatusIndex && (
                <EllipsisIcon className="w-full h-full rounded-full border p-1 text-muted-foreground" />
              )}

              <p
                className={
                  'absolute capitalize text-xs top-9 font-medium tracking-tight text-muted-foreground whitespace-nowrap'
                }
              >
                {status}
              </p>
            </div>
          </div>
          {index < referralStatusesList.length - 1 && (
            <Separator
              className={cn(
                'w-14 border-muted-foreground/60 rounded-xl border',
                {
                  'border-border': index >= currentStatusIndex,
                }
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

import React from 'react';
import { CheckCircle2, CircleDot, XCircleIcon } from 'lucide-react';

import { ReferralStatus } from '@/services/referrals/const';
import { cn } from '@/helpers/utils';

import { Separator } from '../ui/separator';

interface TimelineProps {
  currentStatus: string;
}

export const StatusTimeline: React.FC<TimelineProps> = ({ currentStatus }) => {
  const referralStatusesList = [...Object.keys(ReferralStatus)].filter((i) => {
    if (currentStatus === 'cancelled') {
      return i !== 'rejected' && i !== 'accepted';
    }

    if (currentStatus === 'rejected') {
      return i !== 'cancelled' && i !== 'accepted';
    }

    return i !== 'rejected' && i !== 'cancelled';
  });

  const currentStatusIndex = referralStatusesList.indexOf(currentStatus);

  return (
    <div className="flex items-center gap-2 py-2">
      {referralStatusesList.map((status, index) => (
        <React.Fragment key={status}>
          <div className={cn('flex flex-col items-center', { 'opacity-50': status !== currentStatus })}>
            <div
              className={`w-8 h-8 rounded-full ${
                index <= currentStatusIndex
                  ? status === 'cancelled' || status === 'rejected'
                    ? 'bg-red-600'
                    : 'bg-green-600'
                  : 'bg-muted-foreground'
              } flex relative items-center justify-center`}
            >
              {index <= currentStatusIndex ? (
                status === 'cancelled' || status === 'rejected' ? (
                  <XCircleIcon className="text-white/80" />
                ) : (
                  <CheckCircle2 className="text-white/80" />
                )
              ) : (
                <CircleDot className="text-white/80" />
              )}
              <p
                className={cn(
                  'absolute uppercase text-[10px] top-9 font-medium tracking-tighter text-muted-foreground',
                  { 'text-green-600': index <= currentStatusIndex && status !== 'cancelled' && status !== 'rejected' },
                  { 'text-red-600': (status == 'cancelled' || status === 'rejected') && currentStatusIndex === index },
                )}
              >
                {status}
              </p>
            </div>
          </div>
          {index < referralStatusesList.length - 1 && (
            <Separator
              className={cn('w-10 border-green-600/80 rounded-xl border', {
                'border-border': index >= currentStatusIndex,
              })}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

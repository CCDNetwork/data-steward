import { EditIcon, Trash2Icon } from 'lucide-react';
import { formatDate } from 'date-fns';
import { TableColumn } from '@/components/DataTable/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Referral } from '@/services/referrals';
import { cn } from '@/helpers/utils';
import { ReferralStatus } from '@/services/referrals/const';
import { Tooltip } from '@/components/Tooltip';

export const columns = (
  setSentReferralToDelete: React.Dispatch<React.SetStateAction<Referral | null>>,
  onEditSentReferralClick: (referralRow: Referral) => Promise<void>,
): TableColumn<Referral>[] => [
  {
    accessorKey: 'status',
    id: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const { status } = row.original;

      return (
        <Badge
          className={cn('bg-primary capitalize', {
            'bg-green-600 hover:bg-green-600': status === ReferralStatus.Enrolled,
            'bg-yellow-500 hover:bg-yellow-500': status === ReferralStatus.InEvaluation,
            'bg-orange-500 hover:bg-orange-500': status === ReferralStatus.Withdrawn,
            'bg-red-600 hover:bg-red-600': status === ReferralStatus.Rejected,
          })}
        >
          {status === ReferralStatus.InEvaluation ? 'In Evaluation' : status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'caseNumber',
    id: 'caseNumber',
    header: 'Case number',
    cell: ({ getValue }) => {
      return getValue() || '-';
    },
  },
  {
    accessorKey: 'organizationReferredTo',
    id: 'organizationReferredTo',
    header: 'Sent to',
    cell: ({ row }) => {
      const { organizationReferredTo } = row.original;

      return <div>{organizationReferredTo?.name ?? '-'}</div>;
    },
  },
  {
    accessorKey: 'createdAt',
    id: 'createdAt',
    header: 'Created On',
    isSortable: true,
    cell: ({ getValue }) => {
      return (
        <div className="flex flex-col">
          <span>{formatDate(getValue() as Date, 'dd/MM/yyyy HH:mm')}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'updatedAt',
    id: 'updatedAt',
    header: 'Updated On',
    isSortable: true,
    cell: ({ getValue }) => {
      return (
        <div className="flex flex-col">
          <span>{formatDate(getValue() as Date, 'dd/MM/yyyy HH:mm')}</span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    headerClassName: 'text-right pr-5',
    cell: ({ row }) => {
      const referral = row.original;
      return (
        <div className="text-right">
          {referral.status !== ReferralStatus.Enrolled && (
            <Tooltip tooltipContent={'Edit'}>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e: React.SyntheticEvent) => {
                  e.stopPropagation();
                  onEditSentReferralClick(referral);
                }}
              >
                <EditIcon className="w-5 h-5" />
              </Button>
            </Tooltip>
          )}

          <Tooltip tooltipContent={'Delete'}>
            <Button
              variant="ghost"
              onClick={(e: React.SyntheticEvent) => {
                e.stopPropagation();
                setSentReferralToDelete(referral);
              }}
              size="icon"
            >
              <Trash2Icon className="w-5 h-5 text-destructive" />
            </Button>
          </Tooltip>
        </div>
      );
    },
  },
];

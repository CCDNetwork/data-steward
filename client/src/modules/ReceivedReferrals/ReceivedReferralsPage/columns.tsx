import { formatDate } from 'date-fns';
import { Trash2Icon } from 'lucide-react';
import { TableColumn } from '@/components/DataTable/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Referral } from '@/services/referrals';
import { cn } from '@/helpers/utils';
import { ReferralStatus } from '@/services/referrals/const';
import { Tooltip } from '@/components/Tooltip';

export const columns = (
  setReceivedReferralToDelete: React.Dispatch<
    React.SetStateAction<Referral | null>
  >,
): TableColumn<Referral>[] => [
  {
    accessorKey: 'urgencyFlag',
    id: 'urgencyFlag',
    header: '',
    headerClassName: 'w-0',
    cellClassName: 'pl-0 pt-0 pb-0',
    cell: ({ row }) => (
      <div
        className={cn('w-1.5 bg-red-500 h-[53px]', {
          hidden: !row.original.isUrgent,
        })}
      />
    ),
  },
  {
    accessorKey: 'status',
    id: 'status',
    header: 'Step',
    cell: ({ row }) => {
      const { status, isRejected } = row.original;

      if (isRejected) {
        return <Badge className="bg-red-600 hover:bg-red-600">Rejected</Badge>;
      }

      return (
        <Badge
          className={cn('bg-primary capitalize', {
            'bg-green-600 hover:bg-green-600':
              status === ReferralStatus.Enrolment,
            'bg-yellow-500 hover:bg-yellow-500':
              status === ReferralStatus.Evaluation,
            'bg-orange-500 hover:bg-orange-500':
              status === ReferralStatus.Acceptance,
          })}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'caseNumber',
    id: 'caseNumber',
    header: 'Case number',
    cell: ({ getValue }) => {
      return getValue() ?? '-';
    },
  },
  {
    accessorKey: 'organizationReferredTo',
    id: 'organizationReferredTo',
    header: 'Sender',
    cell: ({ row }) => {
      const { organizationCreated } = row.original;

      return <div>{organizationCreated?.name ?? '-'}</div>;
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
          <Tooltip tooltipContent={'Delete'}>
            <Button
              variant="ghost"
              onClick={(e: React.SyntheticEvent) => {
                e.stopPropagation();
                setReceivedReferralToDelete(referral);
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

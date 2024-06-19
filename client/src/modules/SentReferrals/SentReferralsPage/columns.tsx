import { MoreHorizontal } from 'lucide-react';
import { formatDate } from 'date-fns';

import { TableColumn } from '@/components/DataTable/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Referral } from '@/services/referrals';
import { shortenId } from '@/helpers/common';
import { cn } from '@/helpers/utils';
import { ReferralStatus } from '@/services/referrals/const';

export const columns = (
  setSentReferralToDelete: React.Dispatch<React.SetStateAction<Referral | null>>,
): TableColumn<Referral>[] => [
  {
    accessorKey: 'id',
    id: 'id',
    header: 'Case number',
    cell: ({ row }) => {
      const { id } = row.original;

      return shortenId(id) ?? '-';
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
    accessorKey: 'createdAt',
    id: 'createdAt',
    header: 'Created At',
    cell: ({ getValue }) => {
      return (
        <div className="flex flex-col">
          <span>{formatDate(getValue() as Date, 'MM/dd/yyyy HH:mm')}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'updatedAt',
    id: 'updatedAt',
    header: 'Updated At',
    cell: ({ getValue }) => {
      return (
        <div className="flex flex-col">
          <span>{formatDate(getValue() as Date, 'MM/dd/yyyy HH:mm')}</span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const referral = row.original;

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-white focus:bg-red-600"
                onClick={(e: React.SyntheticEvent) => {
                  e.stopPropagation();
                  setSentReferralToDelete(referral);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

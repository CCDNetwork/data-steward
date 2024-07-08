import { formatDate } from 'date-fns';

import { TableColumn } from '@/components/DataTable/types';
import { Beneficiary } from '@/services/beneficiaryList';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/helpers/utils';

export const columns = (
  handleStatusChange: ({
    beneficiaryId,
    status,
  }: {
    beneficiaryId: string;
    status: 'notDuplicate' | 'acceptedDuplicate' | 'rejectedDuplicate';
  }) => Promise<void>,
  setBeneficiaryToDelete: React.Dispatch<React.SetStateAction<Beneficiary | null>>,
): TableColumn<Beneficiary>[] => [
  {
    header: 'Actions',
    id: 'actions',
    cell: ({ row }) => {
      const beneficiaryRowData = row.original;

      return (
        <div className="text-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Change status</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={(e: React.SyntheticEvent) => {
                  e.stopPropagation();
                  handleStatusChange({ beneficiaryId: beneficiaryRowData.id, status: 'notDuplicate' });
                }}
              >
                Not Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e: React.SyntheticEvent) => {
                  e.stopPropagation();
                  handleStatusChange({ beneficiaryId: beneficiaryRowData.id, status: 'acceptedDuplicate' });
                }}
              >
                Accepted Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e: React.SyntheticEvent) => {
                  e.stopPropagation();
                  handleStatusChange({ beneficiaryId: beneficiaryRowData.id, status: 'rejectedDuplicate' });
                }}
              >
                Rejected Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500 focus:text-white focus:bg-red-500"
                onClick={(e: React.SyntheticEvent) => {
                  e.stopPropagation();
                  setBeneficiaryToDelete(beneficiaryRowData);
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
    accessorKey: 'status',
    id: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const { status } = row.original;

      const statuses: Record<string, string> = {
        notDuplicate: 'Not duplicate',
        acceptedDuplicate: 'Accepted duplicate',
        rejectedDuplicate: 'Rejected duplicate',
      };

      return (
        <Badge
          className={cn(
            'capitalize',
            { 'bg-green-700 dark:text-white hover:bg-green-700': status === 'notDuplicate' },
            { 'bg-primary dark:text-white hover:bg-primary': status === 'acceptedDuplicate' },
            { 'bg-destructive dark:text-white hover:bg-destructive': status === 'rejectedDuplicate' },
          )}
        >
          {statuses[status]}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'firstName',
    id: 'firstName',
    header: 'First Name',
    cell: ({ getValue }) => getValue() || <div className="text-center">&ndash;</div>,
  },
  {
    accessorKey: 'familyName',
    id: 'familyName',
    header: 'Family name',
    cell: ({ getValue }) => getValue() || <div className="text-center">&ndash;</div>,
  },
  {
    accessorKey: 'gender',
    id: 'gender',
    header: 'Gender',
    cell: ({ getValue }) => getValue() || <div className="text-center">&ndash;</div>,
  },
  {
    accessorKey: 'dateOfBirth',
    id: 'dateOfBirth',
    header: 'Date of birth',
    cell: ({ getValue }) => getValue() || <div className="text-center">&ndash;</div>,
  },
  {
    accessorKey: 'hhId',
    id: 'hhId',
    header: 'Household ID',
    cell: ({ getValue }) => getValue() || <div className="text-center">&ndash;</div>,
  },
  {
    accessorKey: 'mobilePhoneId',
    id: 'mobilePhoneId',
    header: 'Mobile phone ID',
    cell: ({ getValue }) => getValue() || <div className="text-center">&ndash;</div>,
  },
  {
    accessorKey: 'govIdType',
    id: 'govIdType',
    header: 'Gov ID type',
    cell: ({ getValue }) => getValue() || <div className="text-center">&ndash;</div>,
  },
  {
    accessorKey: 'govIdNumber',
    id: 'govIdNumber',
    header: 'Gov ID number',
    cell: ({ getValue }) => getValue() || <div className="text-center">&ndash;</div>,
  },
  {
    accessorKey: 'otherIdType',
    id: 'otherIdType',
    header: 'Other ID type',
    cell: ({ getValue }) => getValue() || <div className="text-center">&ndash;</div>,
  },
  {
    accessorKey: 'otherIdNumber',
    id: 'otherIdNumber',
    header: 'Other ID number',
    cell: ({ getValue }) => getValue() || <div className="text-center">&ndash;</div>,
  },
  {
    accessorKey: 'assistanceDetails',
    id: 'assistanceDetails',
    header: 'Assistance details',
    cell: ({ getValue }) => getValue() || <div className="text-center">&ndash;</div>,
  },
  {
    accessorKey: 'activity',
    id: 'activity',
    header: 'Activity',
    cell: ({ getValue }) => getValue() || <div className="text-center">&ndash;</div>,
  },
  {
    accessorKey: 'currency',
    id: 'currency',
    header: 'Currency',
    cell: ({ getValue }) => getValue() || <div className="text-center">&ndash;</div>,
  },
  {
    accessorKey: 'currencyAmount',
    id: 'currencyAmount',
    header: 'Currency amount',
    cell: ({ getValue }) => getValue() || <div className="text-center">&ndash;</div>,
  },
  {
    accessorKey: 'startDate',
    id: 'startDate',
    header: 'Start date',
    cell: ({ getValue }) => getValue() || <div className="text-center">&ndash;</div>,
  },
  {
    accessorKey: 'endDate',
    id: 'endDate',
    header: 'End date',
    cell: ({ getValue }) => getValue() || <div className="text-center">&ndash;</div>,
  },
  {
    accessorKey: 'frequency',
    id: 'frequency',
    header: 'Frequency',
    cell: ({ getValue }) => getValue() || <div className="text-center">&ndash;</div>,
  },
];

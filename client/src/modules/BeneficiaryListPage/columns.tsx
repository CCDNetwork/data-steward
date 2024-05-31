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
    accessorKey: 'firstName',
    id: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'familyName',
    id: 'familyName',
    header: 'Family name',
  },
  {
    accessorKey: 'dateOfBirth',
    id: 'dateOfBirth',
    header: 'Date of birth',
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
    id: 'actions',
    cell: ({ row }) => {
      const beneficiaryRowData = row.original;

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
];

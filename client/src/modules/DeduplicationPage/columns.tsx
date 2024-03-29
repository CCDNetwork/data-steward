import { MoreHorizontal } from 'lucide-react';
import { formatDate } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableColumn } from '@/components/DataTable/types';
import { DUMMY_TYPE } from '@/modules/DeduplicationPage/constants';

export const columns: TableColumn<DUMMY_TYPE>[] = [
  {
    accessorKey: 'uploadDate',
    id: 'uploadDate',
    header: 'Upload Date',
    cell: ({ getValue }) => {
      return (
        <div className="flex flex-col">
          <span>{formatDate(getValue() as Date, 'MM/dd/yyyy')}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'uploadUser',
    id: 'uploadUser',
    header: 'Upload User',
  },
  {
    accessorKey: 'filename',
    id: 'filename',
    header: 'Filename',
  },
  {
    accessorKey: 'duplicates',
    id: 'duplicates',
    header: 'Duplicates',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const reference = row.original;

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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(reference.id)}>Copy ID</DropdownMenuItem>
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

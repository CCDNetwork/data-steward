import { MoreHorizontal } from 'lucide-react';

import { TableColumn } from '@/components/DataTable/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from '@/services/users';
import { Button } from '@/components/ui/button';

export const columns = (): TableColumn<User>[] => [
  {
    accessorKey: 'firstName',
    id: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    id: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'email',
    id: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'organizations',
    id: 'organizations',
    header: 'Organization',
    cell: ({ row }) => {
      const { organizations } = row.original;

      return <div>{organizations[0].name}</div>;
    },
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
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

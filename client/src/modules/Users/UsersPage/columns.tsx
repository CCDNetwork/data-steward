import { formatDate } from 'date-fns';
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

export const columns = (setUserToDelete: React.Dispatch<React.SetStateAction<User | null>>): TableColumn<User>[] => [
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
    header: 'Organisation',
    cell: ({ row }) => {
      const { organizations } = row.original;

      if (!organizations.length) {
        return <div>-</div>;
      }

      return <div>{organizations[0].name ?? '-'}</div>;
    },
  },
  {
    accessorKey: 'role',
    id: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const { role } = row.original;

      return <div className="capitalize">{role}</div>;
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
    id: 'actions',
    cell: ({ row }) => {
      const user = row.original;

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
                className="text-red-500 focus:text-white focus:bg-red-500"
                onClick={(e: React.SyntheticEvent) => {
                  e.stopPropagation();
                  setUserToDelete(user);
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

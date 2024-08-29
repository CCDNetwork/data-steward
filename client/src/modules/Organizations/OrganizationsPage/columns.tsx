import { EditIcon, Trash2Icon } from 'lucide-react';
import { TableColumn } from '@/components/DataTable/types';
import { Button } from '@/components/ui/button';
import { Organization } from '@/services/organizations';
import { formatDate } from 'date-fns';
import { Tooltip } from '@/components/Tooltip';

export const columns = (
  setOrganizationToDelete: React.Dispatch<
    React.SetStateAction<Organization | null>
  >,
  onOrganizationTableRowClick: (organizationRow: Organization) => void
): TableColumn<Organization>[] => [
  {
    accessorKey: 'name',
    id: 'name',
    header: 'Organization Name',
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
      const organization = row.original;

      return (
        <div className="text-right">
          <Tooltip tooltipContent={'Edit'}>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e: React.SyntheticEvent) => {
                e.stopPropagation();
                onOrganizationTableRowClick(organization);
              }}
            >
              <EditIcon className="size-5" />
            </Button>
          </Tooltip>
          <Tooltip tooltipContent={'Delete'}>
            <Button
              variant="ghost"
              onClick={(e: React.SyntheticEvent) => {
                e.stopPropagation();
                setOrganizationToDelete(organization);
              }}
              size="icon"
            >
              <Trash2Icon className="size-5 text-destructive" />
            </Button>
          </Tooltip>
        </div>
      );
    },
  },
];

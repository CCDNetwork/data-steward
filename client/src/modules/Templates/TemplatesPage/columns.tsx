import { formatDate } from 'date-fns';

import { TableColumn } from '@/components/DataTable/types';
import { Template } from '@/services/templates';
import { Button } from '@/components/ui/button';
import { EditIcon, Trash2Icon } from 'lucide-react';
import { Tooltip } from '@/components/Tooltip';

export const columns = (
  setTemplateToDelete: React.Dispatch<React.SetStateAction<Template | null>>,
  onTemplateRowClick: (templateRow: Template) => void
): TableColumn<Template>[] => [
  {
    accessorKey: 'name',
    id: 'name',
    header: 'Template Name',
  },
  {
    accessorKey: 'userCreated',
    id: 'userCreated',
    header: 'Created By',
    cell: ({ row }) => {
      const { userCreated } = row.original;

      return (
        <div>{`${userCreated?.firstName ?? '-'} ${userCreated?.lastName ?? '-'}`}</div>
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
      const template = row.original;

      return (
        <div className="text-right">
          <Tooltip tooltipContent={'Edit'}>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e: React.SyntheticEvent) => {
                e.stopPropagation();
                onTemplateRowClick(template);
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
                setTemplateToDelete(template);
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

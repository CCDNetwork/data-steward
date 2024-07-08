import { formatDate } from 'date-fns';

import { TableColumn } from '@/components/DataTable/types';
import { DeduplicationListing } from '@/services/deduplication';

export const columns: TableColumn<DeduplicationListing>[] = [
  {
    accessorKey: 'uploadUser',
    id: 'uploadUser',
    header: 'Upload User',
    cell: ({ row }) => {
      const { userCreated } = row.original;

      return <div>{`${userCreated?.firstName ?? '-'} ${userCreated?.lastName ?? '-'}`}</div>;
    },
  },
  {
    accessorKey: 'fileName',
    id: 'fileName',
    header: 'File Name',
  },
  {
    accessorKey: 'duplicates',
    id: 'duplicates',
    header: 'Duplicates',
    cell: ({ getValue }) => {
      return (
        <div className="flex flex-col">
          <span>{(getValue() as number) || 'none'}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    isSortable: true,
    id: 'createdAt',
    header: 'Created At',
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
    isSortable: true,
    header: 'Updated At',
    cell: ({ getValue }) => {
      return (
        <div className="flex flex-col">
          <span>{formatDate(getValue() as Date, 'dd/MM/yyyy HH:mm')}</span>
        </div>
      );
    },
  },
];
